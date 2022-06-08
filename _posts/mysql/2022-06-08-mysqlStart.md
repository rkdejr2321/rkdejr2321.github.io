---
title: MySQL이란?
excerpt: "Start MySQL"
autor_porfile: true
share: false
relate: false
categories:
    - MySQL
---

## DataBase
데이터베이스란 특정 조직의 여러 사용자가 **공유**하여 사용할 수 있도록 **통합**해서 **저장**한 **운영** 데이터의 집합이다.  
한 곳에 저장된 데이터를 원하는 곳에서 사용 가능하고 특정 소프트웨어나 프로그램에 종속되지 않는다. 데이터베이스 자체는 별 다른 기능이 없지만 사용자가 원하는 데이터를 저장하고 삭제, 수정, 불러오기 같은 기능을 추가하면  `DataBase Managemt System` 즉 DBMS가 된다.

## SQL
데이터베이스에 정보를 넣고 조작하고 사용하는데 쓰이는 언어가 바로 `Structured Query Language`이고 특정 사용처에 쓰이는 **Domain Specific Language** 도메인 특화 언어이다.
~~~sql
SELECT section_name, menu_name, price
FROM foodcourt_menu
WHERE price > 5000;
~~~
위와 같이 단순한 영어 문장으로 해석한다면 쉽게 이해할 수 있다.

## RDBMS - relational DataBase Management System
관계형 데이터베이스 관리 시스템이란 행과 열로 이루어진 **테이블**을 이용해서 데이터를 관리하고 중복 데이터를 다른 테이블로 분리하여 각 테이블의 상관관계를 정의한 시스템이다. 또한 관계형 데이터베이스에서 **SQL**을 사용하여 데이터를 조작할 수 있다.

## MySQL
`MySQL`은 오픈 소스의 관계형 데이터베이스 관리 시스템(RDBMS)로 무료 또는 저렵한 가격에 성능까지 준수해 세계에서 널리 사용되고 있다.
