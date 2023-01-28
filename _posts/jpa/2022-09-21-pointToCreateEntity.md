---
title: Entity 설계시 주의점
excerpt: "JPA Entity"
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

## 엔티티에는 가급적으로 Setter를 사용하지 말자
Setter가 열려있으면 변경 포인트가 많아 엔티티가 왜 변하는지 추적하기 힘들어져 유지보수가 어렵다.  
Setter 대신에 변경 지점이 명확 하도록 변경을 위한 비즈니스 메서드를 별도로 제공해야 한다.

## 모든 연관관계는 지연로딩으로 설정
EAGER(즉시 로딩)은 어떤 SQL이 실행되는지 추적하기 어렵고 특히 **N+1** 문제가 자주 발생한다.  
실무에서 모든 연관관계는 `지연 로딩`(LAZY)로 설정해야 한다.  
@xxxToOne 관계는 기본적으로 즉시 로딩이므로 직접 지연 로딩으로 설정해서 사용해야 한다.
```java
@ManyToOne(fetch = FetchType.LAZY)
```

> N+1 문제란?  
> 연관 관계에서 발생하는 이슈로 연관 관계가 설정된 엔티티를 조회할 경우에 조회된 데이터 갯수(n) 만큼 연관관계의 조회 쿼리가 추가로 발생하여 데이터를 읽어오게 된다. 이를 N+1 문제라고 한다.

## 컬랙션은 필드에서 초기화 하자
NULL 문제에서 안전하다.  
Hibernate는 Entity를 영속화 할 때, Hibernate가 제공하는 내장 컬렉션으로 변경한다. 임의의 메소드로 컬렉션을 잘못 생성하면 Hibernate 매커니즘에 문제가 발생할 수 있다.

## 테이블, 컬럼명 전략
스프링 부트에서 기본적으로 하이버네이트 매핑 전략을 사용한다.
* 카멜 케이스 -> 언더스코어(memberPoint member_point)
* .(점) -> _(언더스코어)
* 대문자 -> 소문자