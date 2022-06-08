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

MySQL operator를 검색하여 공식 홈페이지에 접속하면 더 많은 연산자를 확인 할 수 있다.

## 숫자와 문자열을 다루는 함수










