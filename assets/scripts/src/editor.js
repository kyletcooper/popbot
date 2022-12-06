wp.domReady(
	() => {
		// Media Picker
		var addMediaPicker = (container) => {
    if (container.dataset.setup) {
        return;
    }
    container.dataset.setup = true;
    let input               = container.querySelector( ".pb_metabox__mediaPicker__input" );
    let choose              = container.querySelector( ".pb_metabox__mediaPicker__choose" );
    let remove              = container.querySelector( ".pb_metabox__mediaPicker__remove" );
    let preview             = container.querySelector( ".pb_metabox__mediaPicker__preview" );
    let picker              = wp.media(
			{
				title: 'Insert image',
				button: {
					text: 'Use this image'
					},
				multiple: false
				}
		)

		picker.on(
			'select',
			() => {
            let media = picker.state().get( "selection" ).first().toJSON();
            console.log( media );
            preview.style.backgroundImage = `url( "${media.sizes.medium.url}" )`;
            input.value                   = media.id;
			}
		);
    choose.addEventListener( "click", () => picker.open() );
    remove.addEventListener(
			"click",
			() => {
            preview.style.backgroundImage = `none`;
            input.value                   = "";
			}
		);
    }

		document.querySelectorAll( ".pb_metabox__mediaPicker" ).forEach(
			container => {
            addMediaPicker( container );
			}
		);
	// Slider
	document.querySelectorAll( '[data-pbslider="parent"]' ).forEach(
		parent => {
        const slider = parent.querySelector( '[data-pbslider="slider"]' );
        const input  = parent.querySelector( '[data-pbslider="input"]' );
        const update = e => {
				let val          = parseInt( e.target.value );
				const max        = parseInt( slider.max );
				const min        = parseInt( slider.min );
				val              = Math.min( Math.max( val, min ), max );
				slider.value     = val;
				input.value      = val;
        };
        slider.addEventListener( "input", update );
        input.addEventListener( "input", update );
		}
	);
	document.querySelectorAll( "[data-pbmetabox-presets-toggle]" ).forEach(
		btn => {
        const field    = btn.closest( "[data-pbmetabox]" );
        const sections = field.querySelectorAll( "[data-pbmetabox-presets]" );
        let isPreset   = btn.dataset.pbmetaboxPresetsToggle == "true";
        btn.setAttribute( "aria-label", "Toggle precision controls" );
        var setPanels             = (usePreset) => {
				isPreset                      = usePreset;
				btn.setAttribute( "aria-pressed", ! isPreset );
				btn.setAttribute( "data-pbmetabox-presets-toggle", isPreset );
				sections.forEach(
            section => {
					const sectionIsPreset = section.dataset.pbmetaboxPresets == "true";
					const isHidden        = sectionIsPreset != isPreset;
					section.hidden        = isHidden;
					section.querySelectorAll( "input" ).forEach( inp => inp.disabled = isHidden );
            }
        )
			}
			setPanels( isPreset );
        btn.addEventListener(
			"click",
			() => {
                setPanels( ! isPreset );
			}
			);
		}
	);
	}
)
