const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { toggleFormat, registerFormatType } = wp.richText;
const { RichTextToolbarButton, RichTextShortcut } = wp.blockEditor;


const formatName = 'pobpot/condition';

const formatIcon = (
    <svg id="task_alt_black_24dp_2_" data-name="task_alt_black_24dp (2)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <rect id="Rectangle_663" data-name="Rectangle 663" width="24" height="24" fill="none" />
        <path id="Path_520" data-name="Path 520" d="M22,5.18,10.59,16.6,6.35,12.36l1.41-1.41,2.83,2.83,10-10Zm-2.21,5.04A7.995,7.995,0,1,1,12,4a7.921,7.921,0,0,1,4.28,1.25l1.44-1.44A9.9,9.9,0,0,0,12,2a10.027,10.027,0,1,0,9.4,6.61Z" />
    </svg>
);

export const formatSettings = {
    title: __('Condition'),
    tagName: 'span',
    className: 'popbot-condition',
    attributes: {
        spellcheck: "false",
    },

    edit({ isActive, value, onChange, contentRef }) {
        const onToggle = () => {
            onChange(
                toggleFormat(value, {
                    type: formatName,
                    className: 'popbot-condition',
                })
            );
        };

        return (
            <Fragment>
                <RichTextShortcut
                    type="primary"
                    character="q"
                    onUse={onToggle}
                />

                <RichTextToolbarButton
                    icon={formatIcon}
                    title={__('Condition')}
                    onClick={onToggle}
                    isActive={isActive}
                    shortcutType="primary"
                    shortcutCharacter="q"
                />
            </Fragment>
        );
    },
};


registerFormatType(formatName, formatSettings);