---
title: SMTP를 이용한 메일 발송
excerpt: "SMTP"
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

## SMTP란?
Simple Mail Transfer Protocol의 약자로 이메일을 송수신할 때 사용되는 프로토콜이다. SMTP 서버를 통해 메일을 보낼 수 있는데 여기서는 구글 메일 서버를 이용하기 위해 구글 게정이 필요하다.

## 구글 계정 설정
기존 구글 메일 서버를 이용하기 위해서는 구글 계정에서 보안 설정이 낮은 앱 허용을 변경해주면 되는데 2022 5월 30일부로 지원하지 않는다. 따라서 몇가지 설정을 추가로 해줘야한다.

### 구글 계정 로그인 및 보안 설정
<div><img src="../../assets/images/blogImg/google-SMTP.png"/></div>
2단계 인증과 앱 비밀번호를 생성해주면 된다.

### 2단계 인증
<div><img src="../../assets/images/blogImg/2단계인증.png"/></div>

### 앱 비밀번호 생성
<div><img src="../../assets/images/blogImg/app-password-create.png"/></div>
<div><img src="../../assets/images/blogImg/app-password.png"/></div>

기기용 앱 비밀번호를 properties 파일에 사용해야한다.

## Spring 설정
build.gradle에 의존성 추가
~~~
implementation 'org.springframework.boot:spring-boot-starter-mail'
implementation group: 'com.sun.mail', name: 'javax.mail', version: '1.4.7'
implementation group: 'org.springframework', name: 'spring-context-support', version: '5.2.6.RELEASE'
~~~

application-email
