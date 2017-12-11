// Used in a schema to check whether the dom field should be left or removed
export function domCheck(tgtField) {
	// if an insert OR update OR scrub then remove/unset the field
	if (tgtField.isInsert || tgtField.isUpdate || tgtField.isScrub) {
		tgtField.unset();
	}

	// otherwise leave the field as it is
	return undefined;
}
