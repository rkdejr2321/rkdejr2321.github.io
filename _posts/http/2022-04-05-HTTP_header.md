---
title: HTTP 헤더 - 일반헤더
excerpt: "HTTP header"
autor_porfile: true
share: false
relate: false
categories:
    - HTTP
---

## HTTP 헤더
```
filed-name: OWS(띄어쓰기 허용) field-value OWS
ex) Content-Type: text/html;charset=UTF-8
```
HTTP 전송에 필요한 모든 부가정보  
ex) 메세지 바디의 내용, 크기, 압축, 인증, 요청 클라이언트, 서버 정보, 캐시 관리 정보...

과거에는 4개로 분류
* General 헤더: 메시지 전체에 적용되는 정보
* Request 헤더: 요청 정보
* Response 헤더: 응답 정보
* Entity 헤더: 엔티티 바디 정보

<p align="center"><img src="../../assets/images/blogImg/http_body_past.png"/></p>

메세지 본문은 **엔티티 본문**을 전달하는데 사용
- 엔티티 본문: 요청이나 응답에서 전달할 실제 데이터P

쿠키를 사용하지 않을 경우  습ㅐ
HTTP는 무상태 프로토콜이기 때문에 로그인 등 유지해야될 기능이 새로고침하면 다 없어진다(로그인이 풀린다)  
모든 요청에 사용자 정보가 포함되도록 개발해야하지만 브라우저를 완전히 종료하고 다시 열면 문제가 생긴다.  

쿠키 사용ㅡㅂㄴ

<p align="center"><img src="../../assets/images/blogImg/cookie1.png"/></p>
<p align="center"><img src="../../assets/images/blogImg/cookie2.png"/></p>
<p align="center"><img src="../../assets/images/blogImg/cookie3.png"/></p>

요청할 때마다 쿠키를 조회하여 사용  스
사용자 로그인 세션관리나 광고 정보 트래킹에 주로 사용됨 ㅕ
쿠키 정보는 항상 서버에 전송되기 때문에 네트워크 트래픽이 추가로 발생한다. 그러므로 최소한의 정보(세션 id, 인증 토큰)만 사용  
서버에 전송하지 않고 웹 브라우저 내부에 데이터를 저장하는 **웹 스토리지** 방법도 존재  ep
보안에 민감한 데이터는 저장하면 안된다.  

### 쿠키 생명주기 
* Set-Cookie: **expire** = Sat, 26-Dec-2020 xx:xx:xx GMT
  * 만료일이 되면 쿠키 삭제
* Set-Cookie: max-age=3600(초단위)
  * 0이나 음수를 지정하면 쿠키 삭제

> 세션 쿠키: 만료 날짜를 생략하면 브라우저 종료시 까지만 유지  
> 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지

### 쿠키 도메인
* 명시: 명시한 문서 기준 도메인 + 서브 도메인을 포함하여 접근 가능
* 생략: 현재 문서 기준 도메인만 적용 서브 도메인에서는 쿠키에 접근 불가


### 쿠키 경로
이 경로를 포함한 하위 경로 페이지만 쿠키 접근

### 쿠키 보안
* Secure
  * HTTPS인 경우에만 전송
* HttpOnly
  * XSS 공격 방지
  * 자바스크립트에서 접근 불가
  * HTTP 전송에만 사용
* SameSite
  * XSRF 공격 방지
  * 요청 도메인과 쿠키에 설정된 도메인이 같은 경우에만 쿠키 전송