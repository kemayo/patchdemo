/* global OO, $ */
( function () {
	var myWikis, closedWikis, branchSelect, form, submit, showClosed,
		presetInput, reposField, reposInput, reposFieldLabel,
		$wikisTable = $( '.wikis' );

	function updateTableClasses() {
		$wikisTable.toggleClass( 'hideOthers', !!myWikis.isSelected() );
		$wikisTable.toggleClass( 'hideOpen', !!closedWikis.isSelected() );
	}

	form = document.getElementById( 'new-form' );
	if ( form ) {
		submit = OO.ui.infuse( $( '.form-submit' ) );
		form.addEventListener( 'submit', function () {
			submit.setDisabled( true );
			return false;
		} );

		if ( $( '.myWikis' ).length ) {
			myWikis = OO.ui.infuse( $( '.myWikis' ) );
			myWikis.on( 'change', updateTableClasses );

			closedWikis = OO.ui.infuse( $( '.closedWikis' ) );
			closedWikis.on( 'change', updateTableClasses );

			if ( $( '.showClosed' ).length ) {
				showClosed = OO.ui.infuse( $( '.showClosed' ) );
				showClosed.on( 'click', function () {
					myWikis.setSelected( true );
					closedWikis.setSelected( true );
					updateTableClasses();
				} );
			}
		}

		branchSelect = OO.ui.infuse( $( '.form-branch' ) );
		branchSelect.on( 'change', function () {
			var branch, repo, validBranch;
			branch = branchSelect.value;
			for ( repo in window.repoBranches ) {
				validBranch = window.repoBranches[ repo ].indexOf( branch ) !== -1;
				reposInput.checkboxMultiselectWidget
					.findItemFromData( repo )
					.setDisabled( !validBranch || repo === 'mediawiki/core' );
			}
			reposInput.emit( 'change' );
		} );

		presetInput = OO.ui.infuse( $( '.form-preset' ) );
		reposInput = OO.ui.infuse( $( '.form-repos' ) );
		reposField = OO.ui.infuse( $( '.form-repos-field' ) );

		reposFieldLabel = reposField.getLabel();

		presetInput.on( 'change', OO.ui.debounce( function () {
			var val = presetInput.getValue();
			if ( val === 'custom' ) {
				reposField.$body[ 0 ].open = true;
			}
			if ( val !== 'custom' ) {
				reposInput.setValue( window.presets[ val ] );
			}
		} ) );
		reposInput.on( 'change', OO.ui.debounce( function () {
			var selected = 0, enabled = 0,
				val, presetName, matchingPresetName;

			val = reposInput.getValue();
			matchingPresetName = 'custom';
			for ( presetName in window.presets ) {
				if ( window.presets[ presetName ].sort().join( '|' ) === val.sort().join( '|' ) ) {
					matchingPresetName = presetName;
					break;
				}
			}
			if ( presetInput.getValue() !== matchingPresetName ) {
				presetInput.setValue( matchingPresetName );
			}

			reposInput.checkboxMultiselectWidget.items.forEach( function ( option ) {
				if ( !option.isDisabled() ) {
					enabled++;
					if ( option.isSelected() ) {
						selected++;
					}
				}
			} );

			reposField.setLabel( reposFieldLabel + ' (' + selected + '/' + enabled + ')' );
		} ) );

		reposInput.emit( 'change' );
	}

}() );
