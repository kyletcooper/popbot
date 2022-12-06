<?php

namespace popbot;

class User_Journey_Monitor {

	const SESSION_LENGTH_IN_SECONDS = 1800; // 30 minutes

	function init() {
	}

	function set_geolocation_cookies() {
		// 'user.location.region'
		// 'user.location.continent'
		// 'user.location.country'
		// 'user.location.city'
	}

	function update_user_journey(): void {
		if ( wp_doing_ajax() || is_admin() ) {
			return;
		}

		if ( ! array_key_exists( 'popBot_geolocation_city', $_COOKIE ) ) {
			$this->set_geolocation_cookies();
		}

		$expire = time() + 60 * 60 * 24 * 90; // 90 Days

		// LAST FOR 90 DAYS
		// Last page
		// Set last hit every time so we know if it's the first page in a session.
		$lastPageHit = intval( $_COOKIE['popBot_journey_lastPageHit'] ?? 0 );
		setcookie( 'popBot_journey_lastPageHit', time(), $expire, '/' );

		// First visit
		// Set only once so we know when the first session was.
		$firstVisit = intval( $_COOKIE['popBot_journey_firstVisitHit'] ?? time() );
		if ( ! isset( $_COOKIE['popBot_journey_firstVisitHit'] ) ) {
			setcookie( 'popBot_journey_firstVisitHit', time(), $expire, '/' );
		}

		// LAST FOR SESSION ONLY
		// Referrer
		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			setcookie( 'popBot_journey_referrer', esc_url( $_SERVER['HTTP_REFERER'] ), 0, '/' );
		} elseif ( ! isset( $_COOKIE['popBot_journey_referrer'] ) ) {
			setcookie( 'popBot_journey_referrer', '', 0, '/' );
		}

		// Returning
		if ( time() - $firstVisit > static::SESSION_LENGTH_IN_SECONDS ) {
			setcookie( 'popBot_journey_returning', 1, 0, '/' );
		} else {
			setcookie( 'popBot_journey_returning', 0, 0, '/' );
		}

		// Landing
		if ( time() - $lastPageHit > static::SESSION_LENGTH_IN_SECONDS ) {
			setcookie( 'popBot_journey_landing', 1, 0, '/' );
		} else {
			setcookie( 'popBot_journey_landing', 0, 0, '/' );
		}

		// Page Count
		$pagesVisited = intval( $_COOKIE['popBot_journey_pageCount'] ?? 0 );
		setcookie( 'popBot_journey_pageCount', intval( $pagesVisited ) + 1, 0, '/' );
	}
}
