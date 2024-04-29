---
title: 다른 서버와 통신하기
excerpt: "WebClient"
autor_porfile: true
share: false
relate: false
categories:
    - springboot
---

## WebClient란?
WebClient는 Spring 5.0에 추가된 인터페이스로 RestTemplate를 대체하는 HTTP 클라이언트이다.   
기존의 동기 API뿐만 아니라 Non-Blocking 및 비동기 방식을 지원해 효율적인 통신이 가능하다.  
* 싱글 쓰레드
* Non-Blocking
* JSON, XML 응답
  

## WebClient 사용법
build.gradle 의존성 추가
```
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

객체 생성
```java
//방법1
WebClient.create(baseUrl);

//방법2
WebClient webClient = WebClient.Builder().baseUrl();
```

Request & Response
```java
weclient.method(HttpMethod.GET) //HTTP 요청 메소드
        .uri() //요청 URI
        .contentType() //body에 담을 데이터 형식
        .bodyValue() //Request Body에 담을 값
        .retrieve() //ClientResponse 객체의 body를 받아 디코딩 후 객체로 변환
        .bodyToMono() // 가져온 body를 Mono로 변환, bodyToFlux도 사용 가능
        .block();//동기식 방법으로 통신 생략하면 비동기
```

> retrive() vs exchage()  
> exchage를 사용하면 ClientResponse를 상태값, 헤더와 함께 가져와 세밀한 조정이 가능하지만 Response에 대한 모든 처리를 직접하게 되면 **메모리 누수**가 발생할 가능성이 있어 `retrive()`사용을 권장
>

[WebClient 공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux)에 더 자세한 내용이 나와 있으니 확인하면 좋을 것 같다.
