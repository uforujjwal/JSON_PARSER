function whiteSpace (jasonString) {
	var temp = jasonString
	while (temp[0] == ' ' || temp[0] == '\n') {
		temp = temp.slice(1,temp.length)
	}
	return temp
}

function comma (jasonString) {
	var temp = jasonString
	while (temp[0] == ',') {
		temp = temp.slice(1,temp.length)
	}
	return temp
}
function colon (jasonString) {
	var temp = jasonString
	while (temp[0] == ':') {
		temp = temp.slice(1,temp.length)
	}
	return temp
}

function nullParser (jasonString) {
	if (jasonString.length > 3) {
		if (jasonString.slice(0, 4) == 'null') 
			return [null, jasonString.slice (4, jasonString.length)]			
	}
	return null
}

function boolParser (jasonString) {
	if (jasonString.length > 3) {
		if (jasonString.slice(0, 4) == 'true')
			return [true, jasonString.slice(4,jasonString.length)]
		if (jasonString.slice(0, 5) == 'false')
			return [false, jasonString.slice(5, jasonString.length)]
	}
	return null
}

function numberParser (jasonString) {
	var i = 0, numOut, nm = ''
	if (jasonString.length > 0 ) {		//check if empty jasonString
		if (jasonString[i] == '-') {	//check if -ve number
			nm += jasonString[i]
			i++
		}
		while (jasonString[i] >= '0' && jasonString[i] <= '9') {  //check for digits
			nm += jasonString[i]
			i++
		}
		if (jasonString[i] == '.') {	//check if -ve decimal number
			nm += jasonString[i]
			i++
		}
		while (jasonString[i] >= '0' && jasonString[i] <= '9') {  //check for digits
			nm += jasonString[i]
			i++
		}
		if (jasonString[i] == 'e' || jasonString[i] == 'E') {	//check for exponential 
			nm += jasonString[i]
			i++
		}
		if (jasonString[i] == '-' || jasonString[i] == '+') {	//check for sign of exponent
			nm += jasonString[i]
			i++
		}
		while (jasonString[i] >= '0' && jasonString[i] <= '9') {	//check for digits
			nm += jasonString[i]
			i++
		}
		numOut = parseFloat(nm) 								  //store as number
		return [numOut, jasonString.slice(i, jasonString.length)]
	}
	return null
}

function stringParser (jasonString) {
	if (jasonString[0] == '"') {
		var temp = jasonString.slice(1,jasonString.length)
		return [temp.slice(0,temp.indexOf('"')),temp.slice(temp.indexOf('"') + 1,temp.length)]
	}
	return null
}

function arrayParser (jasonString) {
	var array = [],temp
	if (jasonString.length > 0) {
		jasonString = whiteSpace (jasonString)
		if (jasonString[0] == '[') { 
			jasonString = jasonString.slice(1,jasonString.length)
			jasonString = whiteSpace (jasonString);// console.log("2,"+jasonString);console.log(array)
			while (jasonString[0] !== ']') { //console.log("3,"+jasonString);console.log(array)
				jasonString = whiteSpace (jasonString)
				jasonString = comma(jasonString);//console.log("4,"+jasonString);console.log(array)
				temp = elementParser(jasonString);//console.log(temp)
				array.push(temp[0]);//console.log(array)
				jasonString = temp[1];//console.log(jasonString)
			}
			return [array,jasonString.slice	(1,jasonString.length)]
		}
		return null
	}
	return null
}

function objectParser (jasonString) {
	var obj = {}, key, value
	if (jasonString.length > 0) {
		jasonString = whiteSpace (jasonString)
		if (jasonString[0] == '{') { 
			jasonString = jasonString.slice(1,jasonString.length)
			jasonString = whiteSpace (jasonString);
			while (jasonString[0] !== '}') { 
				jasonString = whiteSpace (jasonString)
				jasonString = comma(jasonString);
				key = stringParser(jasonString);//console.log(key)
				jasonString = whiteSpace(key[1]);//console.log(jasonString)
				jasonString = colon(jasonString);//console.log(jasonString)
				value = elementParser(jasonString);//console.log(value)
				obj[key[0]] = value[0];//console.log(jasonString)
				jasonString = whiteSpace(value[1]);//console.log(jasonString)
			}
			return [obj,jasonString.slice (1,jasonString.length)]
		}
		return null
	}
	return null
}

function elementParser (element) {
	var parsed
	parsed = nullParser(element) 
	if(parsed !== null) return parsed
	parsed = boolParser(element) 
	if(parsed !== null) return parsed
	parsed = stringParser(element) 
	if(parsed !== null) return parsed
	parsed = arrayParser(element) 
	if(parsed !== null) return parsed
	parsed = objectParser(element) 
	if(parsed !== null) return parsed
	parsed = numberParser(element) 
	if(parsed !== null) return parsed	
	return null
}