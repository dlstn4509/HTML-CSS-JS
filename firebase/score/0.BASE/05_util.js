//  startNumber : 난수의 시작 수, count : 난수의 갯수
function random(startNumber, count) {
	return Math.floor( Math.random() * count ) + startNumber;
}

// 0 ~ 9를 받으면 '0'을 더해주는 함수
function zp(n) {
	// if(n<10) return '0'+n;
	// else return n;
	
	return (n < 10) ? '0'+n : n;
	// 삼항 연산자 let a = 조건 ? 실행(참) : 실행(거짓)
}
