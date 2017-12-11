
export function getFieldType(type) {
	let result;

	// if type is a string then just pass its contents back
	if ((typeof type === 'string')) {
		result = type;

	// if type is a constuctor function then pass the name of the function back
	} else if ((typeof type === 'function')) {
		result = type.name;

	// if type is an object then pass the name of type of object in the array back
	} else if ((typeof type === 'object')) {
		result = `Array_${getFieldType(type[0])}`;
	} else {
		result = 'Invalid';
	}

	return result;
}
