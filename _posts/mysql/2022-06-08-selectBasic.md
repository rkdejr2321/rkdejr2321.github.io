---
title: SELECT 기초
excerpt: "Start MySQL"
autor_porfile: true
share: false
relate: false
categories:
    - MySQL
---

## SELECT 전반 기능
SELECT는 테이블에서 원하는 값을 가져올 때 사용한다. 
~~~sql
SELECT * FROM 테이블 명;
-- *은 모든 컬럼을 뜻한다.
-- 마지막에 세미콜론(;) 필수

SELECT 컬럼 이름, 컬럼에 들어있는 값... 
FROM 테이블 명;
-- 컬럼에 들어있는 값이 문자열이면 ''로 감싸줘야한다.

SELECT 컬럼 명 FROM 테이블 명
WHERE 조건문;
-- 조건문에 만족하는 행만 가져옴

SELECT 컬럼 명 FROM 테이블 명 
ORDER BY 컬럼 명A ASC, 컬럼 명B DESC;
-- 정렬 기본 값은 오름차순(ASC) 
-- A를 오름차순 정리하고 그 후 같은 값에서 B를 기준으로 내림차순 정렬 

SELECT 컬럼명 FROM 테이블명
LIMIT 건너뛸 갯수, 가져올 갯수;
-- 30,10이면 앞에 30개를 건너 뛰고 31번부터 10개를 가져옴

SELECT 
    컬럼명 AS 별명
FROM 테이블명;
-- 컬럼명이 별명으로 바뀌어서 출력
~~~

## 각종 연산자들
사칙 연산, 논리 연산, 비교 연산 등 다양한 연산잔를 사용가능
### 사칙연산
~~~sql
SELECT 1 + 2;

SELECT 'ABC' + 3;
-- 문자열에 사칙연산을 하면 문자는 0으로 인식한다.

SELECT '1' + 3;
-- 숫자로 구성된 문자열은 숫자 인식한다.

SELECT 
    컬럼명 A, 컬럼명 B, A+B
FROM 테이블 명
-- A, B, A+B를 한 결과를 보여준다.
~~~

### 참/거짓 연산자
~~~sql
SELECT TRUE, FALSE;
-- 1, 0으로 출력

SELECT !TRUE, NOT 0;
-- TURE, 0의 반대 값이 출력

SELECT TRUE is TRUE;
SELECT TRUE is NOT TRUE;
-- 참이면 1, 아니면 0

SELECT (TRUE IS FALSE) IS NOT TRUE;
-- 괄호 먼저 연산

SELECT TRUE AND FALSE, TRUE OR FALSE;
-- AND: 둘 다 참이면 참 아니면 거짓
-- OR: 둘 중 하나만 참이면 참

SELECT 1 = 1, 2 =! 1, 'A'<>'B';
-- =: 양쪽이 같으면 참
-- !=, <>: 양쪽이 다르면 참

SELECT 2 >= 1, 'A' < 'B';
-- 알파벳은 대소문자 구분 없이 알파벳 순 뒤에 오면 큰 값

SELECT 15 BETWEEN 10 AND 20;
SELECT 30 NOT BETWEEN 10 AND 20;
-- BETWEEN: 10과 20 사이에 있으면 참
-- NOT BETWEEN: 사이에 값이 없으면 참

SELECT 1 IN (1,2,3);
SELECT 4 NOT IN (1,2,3,);
-- IN: 괄호 안에 값이 있으면 참
-- NOT IN: 괄호 안에 값이 없으면 참

SELECT 'HELLO' LIKE 'hel%';
SELECT 'HELLO' LIKE 'HEL__';
-- LIKE %: %자리에 0~N개의 단어가 왔을때 앞에 있는 단어와 일치하면 참
-- LIKE _: _ 갯수만큼 단어가 왔을때 앞에 있는 단어와 일치하면 참
-- 숫자로 된 문자는 숫자로 변환
~~~

> MySQL operator를 검색하여 공식 홈페이지에 접속하면 더 많은 연산자를 확인 할 수 있다.

## 숫자와 문자열을 다루는 함수
### 숫자 관련 함수
~~~sql
SELECT 
    ROUND(0.5),
    CEIL(0.4),
    FLOOR(0.6);
-- ROUND: 반올림
-- CEIL: 올림
-- FLOOR: 내림

SELECT ABS(-1);
-- ABS: 절대값

SELECT 
    GREATEST(1,2,3),
    LEAST(1,2,3,4,5);
-- GREATEST: 괄호 중 가장 큰 값
-- LEAST: 괄호 중 가장 작은 값

SELECT
  MAX(컬럼명),
  MIN(컬럼명),
  COUNT(컬럼명),
  SUM(컬럼명),
  AVG(컬럼명)
FROM 테이블명
WHERE 조건;

-- MAX: 가장 큰 값
-- MIN: 가장 작은 값
-- COUNT: 갯수(NULL 제외)
-- SUM: 총합
-- AVG: 평균

SELECT 
    POW(A,B)
    SQRT(C)
-- POW/POWER: A를 B만큼 제곱
-- SQRT: C의 제곱근(루트)

SELECT 
    TRUNCATE(N,n)
-- N을 소숫점 n자리까지 선택
-- n이 음수면 소수점 앞자리부터 n개를 0으로 변환
~~~

### 문자열 관련 함수
~~~sql
SELECT
    UPPER('abced'),
    LOWER('ABCDE');
-- UCASE/UPPER: 모두 대문자로 변경
-- LCASE, LOWER: 모두 소문자로 변경

SELECT CONCAT(문자열 A, 문자열 B, ...);
-- 괄호 안에 있는 문자열을 이어붙임 숫자는 문자열로 변환

SELECT CONCAT_WS(문자열 A, 문자열 B, 문자열 C...);
-- 문자열 B부터 괄호 안에 있는 문자열을 A로 이어붙임
-- ex) BACADA ...

SELECT
  SUBSTR(문자열, i,j),
  LEFT(문자열, n),
  RIGHT(문자열, n);
-- SUBSTR: i가 양수면 왼쪽에서 음수면 오른쪽에서 i번째부터 j개 추출 
-- LEFT: 왼쪽에서 n개만 추출
-- RIGHT: 오른쪽에서 n개만 추출

SELECT
  LENGTH(문자열),
  CHAR_LENGTH(문자열);
-- LENGTH: 문자열의 바이트 길이
-- CHAR_LENGTH/CHARACTER_LENGTH: 문자열의 문자 갯수

SELECT 
    TRIM(문자열),
    LTRIM(문자열),
    RTRIM(문자열);
-- TRIM: 양쪽 공백 제거
-- L/RTRIM: 좌, 우 공백 제거

SELECT
    LPAD(문자열 A, n, 문자열B),
    RPAD(문자열 A, n, 문자열B);
-- L/RPAD: A의 길이가 n이 될 때까지 B를 왼쪽/오른쪽에 붙임

SELECT REPLACE(문자열 A, 문자열 B, 문자열 C);
-- A에 속한 B를 C로 변경

SELECT INSTR(문자열 A, 문자열 B);
-- A중 B의 첫 위치를 반환, 없으면 0

SELECT CONVERT(A 변환할 타입);
-- A의 타입을 변환한다.
~~~

## 날짜/시간 함수
~~~sql
SELECT CURDATE(), CURTIME(), NOW();
-- CURDATE/CURRENT_DATE: 현재 날짜 반환
-- CURTIME/CURRENT_TIME: 현재 시간 반환
-- NOW/CURRETN_TIMESTAMP: 현재 날짜와 시간 반환
~~~

~~~sql
SELECT
    DATE("yyyy-mm-dd hh:mm:ss"),
    TIME("yyyy-mm-dd hh:mm:ss");
-- DATE: 날짜 문자열 형식만 반환(yyyy-mm-dd)
-- TIME: 시간 문자열 형식만 반환(hh:mm:ss)
~~~
> 날짜와 시간 형식이 아니면 아무것도 반환하지 않는다.

~~~sql
SELECT
  YEAR(OrderDate)
  MONTHNAME(OrderDate),
  MONTH(OrderDate),
  WEEKDAY(OrderDate),
  DAYNAME(OrderDate),
  DAY(OrderDate);

-- YEAR: 주어진 DATETIME값의 년도 반환
-- MONTHNAME: 주어진 DATETIME값의 월(영문) 반환
-- MONTH: 주어진 DATETIME값의 월 반환
-- WEEKDAY:	주어진 DATETIME값의 요일값 반환(월요일: 0 ~ 일요일: 7)
-- DAYNAME:	주어진 DATETIME값의 요일명 반환
-- DAYOFMONTH/DAY: 주어진 DATETIME값의 날짜(일) 반환
~~~

~~~sql
SELECT HOUR(시간 문자열), MINUTE(시간 문자열), SECOND(시간 문자열);
-- HOUR	주어진 DATETIME의 시 반환
-- MINUTE	주어진 DATETIME의 분 반환
-- SECOND	주어진 DATETIME의 초 반환
~~~

~~~sql
SELECT ADDCATE(날짜/시간 문자열, INTERVAL N, 항목);
-- 항목(YEAR, MONTH,HOUR...)에서 N을 더한 문자열 반환
~~~

~~~sql
SELECT 
    TIMEDIFF(날짜/시간 문자열, 날짜/시간 문자열);
    DATEDIFF(날짜/시간 문자열, 날짜/시간 문자열);
-- TIMEDIFF: 두 날짜/시간 간 시간차
-- DATEDIFF: 두 날짜/시간 간 일수차
~~~

~~~sql
SELECT LAST_DAY(날짜 문자열);
-- LAST_DAY: 날짜 문자열의 해당 달의 마지막 날짜
~~~

|형식|설명|
|------|---|
|**%Y**|년도 4자리|
|**%y**|년도 2자리|
|**%M**|월 영문|
|**%m**|월 숫자|
|**%D**|일 영문(1st, 2nd...)|
|**%d**, **%e**|일 숫자(01~31)|
|**%T**|hh:mm:ss|
|**%r**|hh:mm:ss AM/PM|
|**%H**, %k**|시(~23)|
|**%h**, %l**|시(~12|
|**%i**|분|
|**%S, **%s**|초|
|**%p**|AM/PM|

~~~sql
SELECT DATE_FORMAT(날짜/시간 문자열, 형식);
-- 지정한 형식대로 반환
-- ex) 2022-06-09, %Y-%m-%d %T = 2022-06-09 00:00:00

SELECT SRT_TO_DATE(날짜/시간 문자열, 형식);
-- 지정한 형식으로 해석하여 반환
-- ex) 2022-06-09 23:53:12,
~~~

> `SRT_TO_DATE`는 문자열과 날짜 포멧이 다르면 **NULL** 반환

## 기타 함수
~~~sql
SELECT IF(조건, A, B);
-- 조건이 창이면 A, 거짓이면 B 반환

SELECT IFNULL(A, B);
-- A가 NULL이면 B 반환, NULL이 아니면 A 반환
~~~

## GROUP BY
~~~sql
SELECT 컬럼명 FROM 테이블명
GROUP BY 그룹화 할 컬럼명
WITH ROLLUP;
-- 그룹화 할 컬럼명에 대한 값을 중복 없이 반환
-- WITH ROLLUP: 집계한 데이터의 합을 마지막 행에 추가
~~~
> WITH ROLLUP은 `ORDER BY`와 함께 사용 불가

~~~sql
SELECT
  컬럼명
FROM 테이블명
GROUP BY 컬럼명
HAVING 조건;
-- 그룹 집계 후 조건에 만족하는 값들만 반환
~~~

> `WHERE`은 그룹하기 전 데이터, `HAVING`은 그룹 후 집계에 사용

~~~sql
SELECT DISTINCT 컬럼명;
-- 컬럼명에 대한 값을 중복 없고 정렬 없이 반환
~~~

> 집계함수가 사용되지 않고 GROUP BY와 달리 정렬을 하지 않아 더 빠르다.



