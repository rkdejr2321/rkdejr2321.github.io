---
title: 스프링 MVC 기본 기능
excerpt: "Spring MVC basic Funtion"
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

## 프로젝트 생성
[https://start.spring.io](https://start.spring.io)에 접속
프로젝트 선택:  
* Project: Gradle     
* Spring Boot: 가장 높은 버전 선택
 * SNAPSHOT과 같은 영어가 뒤에 붙어있으면 정식버전이 아님  
* Language: Java  
* Packgin: Jar  
* Java: 11  
* groupId: 보통 기업 이름  
* artifactId: 프로젝트 이름  
* Dependencies: Spring Web, Thymleaf(html 템플릿), Lombok - 필요한 dependency 추가 GNTERRATE 클릭 후 압축 해제


> JSP를 사용하지 않기 떄문에 내장 서버 사용에 최적화 되어 있는 Jar 선택

### Welcome 페이지 만들기
스프링 부트 **Jar**를 사용하면 /resource/static 위치에 index.html 파일을 두면 Welcome로 처리
<details>
<summary>코드</summary>
<div markdown="1">
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head> 
<body>
<ul>
    <li>로그 출력
        <ul>
            <li><a href="/log-test">로그 테스트</a></li>
        </ul>
    </li>
    <!-- -->
    <li>요청 매핑
        <ul>
            <li><a href="/hello-basic">hello-basic</a></li>
            <li><a href="/mapping-get-v1">HTTP 메서드 매핑</a></li>
            <li><a href="/mapping-get-v2">HTTP 메서드 매핑 축약</a></li>
            <li><a href="/mapping/userA">경로 변수</a></li>
            <li><a href="/mapping/users/userA/orders/100">경로 변수 다중</a></li>
            <li><a href="/mapping-param?mode=debug">특정 파라미터 조건 매핑</a></li>
            <li><a href="/mapping-header">특정 헤더 조건 매핑(POST MAN 필요)</a></
            li>
            <li><a href="/mapping-consume">미디어 타입 조건 매핑 Content-Type(POST
                MAN 필요)</a></li>
            <li><a href="/mapping-produce">미디어 타입 조건 매핑 Accept(POST MAN
                필요)</a></li>
        </ul>
    </li>
    <li>요청 매핑 - API 예시
        <ul>
            <li>POST MAN 필요</li>
        </ul>
    </li>
    <li>HTTP 요청 기본
        <ul>
            <li><a href="/headers">기본, 헤더 조회</a></li>
        </ul>
    </li>
    <li>HTTP 요청 파라미터
        <ul>
            <li><a href="/request-param-v1?username=hello&age=20">요청 파라미터
                v1</a></li>
            <li><a href="/request-param-v2?username=hello&age=20">요청 파라미터
                v2</a></li>
            <li><a href="/request-param-v3?username=hello&age=20">요청 파라미터
                v3</a></li>
            <li><a href="/request-param-v4?username=hello&age=20">요청 파라미터
                v4</a></li>
            <li><a href="/request-param-required?username=hello&age=20">요청
                파라미터 필수</a></li>
            <li><a href="/request-param-default?username=hello&age=20">요청
                파라미터 기본 값</a></li>
            <li><a href="/request-param-map?username=hello&age=20">요청 파라미터
                MAP</a></li>
            <li><a href="/model-attribute-v1?username=hello&age=20">요청 파라미터
                @ModelAttribute v1</a></li>
            <li><a href="/model-attribute-v2?username=hello&age=20">요청 파라미터
                @ModelAttribute v2</a></li>
        </ul>
    </li>
    <li>HTTP 요청 메시지
        <ul>
            <li>POST MAN</li>
        </ul>
    </li>
    <li>HTTP 응답 - 정적 리소스, 뷰 템플릿
        <ul>
            <li><a href="/basic/hello-form.html">정적 리소스</a></li>
            <li><a href="/response-view-v1">뷰 템플릿 v1</a></li>
            <li><a href="/response-view-v2">뷰 템플릿 v2</a></li>
        </ul>
    </li>
    <li>HTTP 응답 - HTTP API, 메시지 바디에 직접 입력
        <ul>
            <li><a href="/response-body-string-v1">HTTP API String v1</a></li>
            <li><a href="/response-body-string-v2">HTTP API String v2</a></li>
            <li><a href="/response-body-string-v3">HTTP API String v3</a></li>
            <li><a href="/response-body-json-v1">HTTP API Json v1</a></li>
            <li><a href="/response-body-json-v2">HTTP API Json v2</a></li>
        </ul>
    </li>
</ul>
</body>
</html>
```
</div>
</details>

## 로깅이란?
운영 시스템에서 System.out.println() 같은 시스템 콘솔을 사용해서 필요한 정보를 출력하지 않고 **로깅 라이브러리**를 사용한다.  

### 로깅 라이브러리
스프링 부트 라이브러리를 사용하면 로깅 라이브러리(spring-boot-starter-logging)가 함께 포함된다.
* SLF4J: 인터페이스 
* Logback: SLF4J의 구현체로 실무에서 대부분 사용

로그 선언: private Logger log = LoggerFactory.getLogger(클래스 이름.class);  
로그 호출: log.info("로그 내용")

### LogTestController
~~~java
@Slf4j
@RestController
public class LogTestController {

    // Slf4j 어노테이션이 있으면 필요없음
    private final Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping("/log-test")
    public String logTest() {

        String name = "Spring";

        System.out.println("name = " + name);

        log.trace("trace log={}", name);
        log.debug("debug log={}", name);
        log.info("info log={}", name);
        log.warn("warn log={}", name);
        log.error("error log={}", name);


        return "ok";
    }
}
~~~

`@RequestController`: 반환 값이 **HTTP 메시지 바디**에 바로 입력되어 결과로 ok 텍스트를 볼 수 있다.

출력 창
~~~
2022-05-22 20:58:35.997 TRACE 51006 --- [nio-8080-exec-5] hello.springmvc.basic.LogTestController  : trace log=Spring
2022-05-22 20:58:36.003 DEBUG 51006 --- [nio-8080-exec-5] hello.springmvc.basic.LogTestController  : debug log=Spring
2022-05-22 20:58:36.003  INFO 51006 --- [nio-8080-exec-5] hello.springmvc.basic.LogTestController  : info log=Spring
2022-05-22 20:58:36.003  WARN 51006 --- [nio-8080-exec-5] hello.springmvc.basic.LogTestController  : warn log=Spring
2022-05-22 20:58:36.003 ERROR 51006 --- [nio-8080-exec-5] hello.springmvc.basic.LogTestController  : error log=Spring
~~~
* 시간, 로그 레벨, 프로세스 ID, 쓰레드명, 클래스명, 로그 메세지가 나온다.
* 로그 레벨: Trace > DEBUG > INFO > WARN > ERROR
* 개발 서버는 **debug**부터 출력하고 운영 서버는 **info**부터 출력한다.
* `@Slf4j`을 사용해도 로그 출력 가능하다. 

### 로그 레벨 설정
application.properties에서 변경 가능하다.
~~~
#전체 로그 레벨 설정(기본 info)
logging.level.root=info

#hello.springmvc 패키지와 그 하위 로그 레벨 설정
logging.level.hello.springmvc=debug
~~~

log.debug("data" + data) 형식으로 사용하게 되면 문자 더하기 연산이 일어나 리소스 낭비로 이어진다. 올바르게 사용하려면 `log.info("data={}", data)`로 사용하자.

### 로그 사용시 장점
* 쓰레드 정보, 클래스 이름 같은 부가 정보를 함께 볼 수 있고, 출력 모양을 조정할 수 있다.
* 로그 레벨에 따라 개발 서버에서는 모든 로그를 출력하고, 운영서버에서는 출력하지 않는 등 로그를 상황에 맞게 조절할 수 있다.
* 시스템 아웃 콘솔에만 출력하는 것이 아니라, 파일이나 네트워크 등, 로그를 별도의 위치에 남길 수 있다.
* 파일로 남길 때는 일별, 특정 용량에 따라 로그를 분할하는 것도 가능하다.
* 성능도 일반 System.out보다 좋다. (내부 버퍼링, 멀티 쓰레드 등등) 그래서 실무에서는 꼭 **로그**를 사용해야 한다

> 로그에 대한 자세한 내용  
> SLF4J - [https://www.slf4j.org](https://www.slf4j.org)  
> Logback - [https://logback.qos.ch](https://logback.qos.ch)  


## 요청 매핑
### 기본 요청: 다중 url, 모든 HTTP 메소드 허용
~~~java
@RestController
public class MappingController {

    private Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping("/hello-basic")
    public String helloBasic() {
        log.info("hello basic");
        return "ok";
    }
}
~~~
* /hello-basic URL 호출이 오면 메소드가 실행된다.
* {"hello-basic, "hello-go", ...}와 같이 다중 설정 가능하다.

### HTTP 메소드 매핑: 특정 HTTP 메소드에서만 요청 허용
~~~java
@RestController
public class MappingController {

    private Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping(value = "/mapping-get-v1", method = RequestMethod.GET)
    public String mappingGetV1() {
        log.info("mappingGetV1");
        return "ok";
    }
}
~~~
축약 방법
~~~java
@RestController
public class MappingController {

    private Logger log = LoggerFactory.getLogger(getClass());

     /**
     * 편리한 축약 어노테이션 (코드보기)
     * @GetMapping
     * @PostMapping
     * @PutMapping
     * @DeleteMapping
     * @PatchMapping
     */
    @GetMapping(value = "/mapping-get-v2")
    public String mappingGetV2() {
        log.info("mappingGetV1");
        return "ok";
    }
}
~~~

* 만약 GET 메소드가 아닌 다른 메소드로 요청하면 405(Method Not Allowed) 상태코드 반환
* HTTP 메소드를 축약한 어노테이션을 사용하는 것이 더 직관적. 어노테이션에 들어가보면 `@RequestMapping`과 `method`를 지정한 것을 확인할 수 있다.

### 경로 변수 사용
~~~java
@RestController
public class MappingController {

    private Logger log = LoggerFactory.getLogger(getClass());

    /**
     * PathVariable 사용
     * 변수명이 같으면 생략 가능
     * @PathVariable("userId") String userId -> @PathVariable userId
     */
    @GetMapping("/mapping/{userId}")
    public String mappingPath(@PathVariable("userId") String data) {
        log.info("mappingPath userId={}", data);
        return "ok";
    }
}
~~~

* http://localhost:8080/mapping/userA로 실행
* @RequestMapping 은 URL 경로를 템플릿화 할 수 있는데, @PathVariable을 사용하면 매칭 되는 부분을 편리하게 조회할 수 있다.
* 다중 경로도 허용

### 특정 파라미터 조건 매핑
잘 사용하지 않는다.
~~~java
@RestController
public class MappingController {
    
    private final Logger log = LoggerFactoy.getLogger(getClass());
 
    /**
     * 파라미터로 추가 매핑
     * params="mode",
     * params="!mode"
     * params="mode=debug"
     * params="mode!=debug" (! = )
     * params = {"mode=debug","data=good"}
     */
    @GetMapping(value = "/mapping-param", params = "mode=debug")
    public String mappingParam() {
        log.info("mappingParam");
        return "ok";
    }
}
~~~

http://localhost:8080/mapping-param?mode=debug로 실행

### 특정 헤더 조건 매핑
파라미터 매핑과 비슷하지만, HTTP 헤더를 사용한다.  
Postman으로 테스트
~~~java
@RestController
public class MappingController {
    
    private final Logger log = LoggerFactoy.getLogger(getClass());
 
    /**
     * 특정 헤더로 추가 매핑
     * header="mode",
     * header="!mode"
     * header="mode=debug"
     * header="mode!=debug" (! = )
     * header = {"mode=debug","data=good"}
     */
    @GetMapping(value = "/mapping-param", headers = "mode=debug")
    public String mappingHeader() {
        log.info("mappingHeader");
        return "ok";
    }
}
~~~

### 미디어 타입 조건 매핑 - HTTP 요청 Content-Type, consume
~~~java
@RestController
public class MappingController {
    
    private final Logger log = LoggerFactoy.getLogger(getClass());
 
    /**
     * Content-Type 헤더 기반 추가 매핑 Media Type
     * consumes="application/json"
     * consumes="!application/json"
     * consumes="application/*"
     * consumes="*\/*"
     * MediaType.APPLICATION_JSON_VALUE
     */
    @PostMapping(value = "/mapping-consume", consumes = "application/json")
    public String mappingConsumes() {
        log.info("mappingConsumes");
        return "ok";
    }
}
~~~

* HTTP 요청의 **Content-Type** 헤더를 기반으로 미디어 타입으로 매핑 맞지 않으면 415(Unsupported Media Type) 상태코드 반환
* "application/json" 대신 org.springframework.http.MediaType에 들어있는 값으로 사용 가능
  * ex) MediaType.APPLICATION_JSON_VALUE

### 미디어 타입 조건 매핑 - HTTP 요청 Accept, produce
~~~java
@RestController
public class MappingController {
    
    private final Logger log = LoggerFactoy.getLogger(getClass());
 
    /**
     * Accept 헤더 기반 Media Type
     * produces = "text/html"
     * produces = "!text/html"
     * produces = "text/*"
     * produces = "*\/*"
     */
    @PostMapping(value = "/mapping-produce", produces = MediaType.TEXT_HTML_VALUE)
    public String mappingProduces() {
        log.info("mappingProduces");
        return "ok";
    }
}
~~~

HTTP 요청의 **Accept** 헤더를 기반으로 미디어 타입으로 매핑 맞지 않으면 406(Not Acceptable) 상태코드 반환

## 요청 매핑 - API
회원 관리 HTTP 요청 매핑 api를 구현해보자 

|기능|HTTP method|uri|
|---|-----------|---|
|회원 목록 조회|GET|/users|
|회원 등록|POST|/users|
|회원 조회|GET|/users/{userId}|
|회원 삭제|DELETE|/users/{userId}|
|회원 수정|PATCH|/users/{userId}|

### MappingClassController
~~~java
@RestController
// /mapping은 다른 예제와 구별하기 위해 사용
@RequestMapping("/mapping/users")
public class MappingClassController {

    @GetMapping()
    public String users() {
        return "get users";
    }

    @PostMapping()
    public String addUser() {
        return "post user";
    }

    @GetMapping("/{userId}")
    public String findUser(@PathVariable String userId){
        return "get userId= "+userId;
    }

    @PatchMapping("/{userId}")
    public String updateUser(@PathVariable String userId){
        return "update userId= "+userId;
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId){
        return "delete userId= "+userId;
    }
}
~~~

* Postman으로 테스트
* {userid} 부분은 실제 데이터를 넣으면 된다. ex) /users/userA

## HTTP 요청 - 기본, 헤더 조회
~~~java
@Slf4j
@RestController
public class RequestHeaderController {

    @RequestMapping("/headers")
    public String headers(HttpServletRequest request,
                          HttpServletResponse response,
                          HttpMethod httpMethod,
                          Locale locale,
                          @RequestHeader MultiValueMap<String, String> headerMap,
                          @RequestHeader("host") String host,
                          @CookieValue(value = "myCookie", required = false) String cookie) {

        log.info("request={}", request);
        log.info("response={}", response);
        log.info("httpMethod={}", httpMethod);
        log.info("locale={}", locale);
        log.info("headerMap={}", headerMap);
        log.info("header host={}", host);
        log.info("myCookie={}", cookie);
        return "ok";
    }
}
~~~

* HttpServletRequest
* HttpServletResponse
* HttpMethod : HTTP 메서드를 조회 - `org.springframework.http.HttpMethod`
* Locale : Locale 정보를 조회 - 언어
* @RequestHeader **MultiValueMap**<String, String>: 하나에 key에 여러 value를 받을 수 있다.
  * ex) keyA=value1&keyA=value2 -> key로 조회하면 [value1,value2]
* @RequestHeader("host"): 특정 헤더 정보 조회
* @CookieValue(value = "myCookie", required = false): 특정 쿠키 조회
  * required: 필수 여부

> `@Conroller`의 사용 가능한 **파라미터 목록**은 다음 공식 메뉴얼에서 확인할 수 있다.  
> [https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annarguments](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annarguments)  

> `@Conroller`의 사용 가능한 **응답 값 목록**은 다음 공식 메뉴얼에서 확인할 수 있다.  
> [https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annreturn-types](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annreturn-types)

## HTTP 요청 파라미터 - 쿼리 파라미터, HTML form
클라이언트에서 서버로 요청 데이터를 전달할 때 주로 3가지 방법이 있다.
* GET - 쿼리 파라미터: 메시지 바디 없이, URL의 쿼리 파라미터에 데이터를 포함해서 전달
* POST - HTML form: 메시지 바디에 쿼리 파리미터 형식으로 전
* HTTP message Body에 직접 데이터를 담아서 요청

HttpServletRequest에 `request.getParameter()`를 사용하면 **Get-쿼리 파라미터**와 **POST-HTML form** 두가지 요청 파라미터를 조회할 수 있다. 이것을 간단히 **요청 파라미터 조회**라고 한다.

### RequestParamController
~~~java
@Slf4j
@Controller
public class RequestParamController {

    @RequestMapping("/request-param-v1")
    public void requestParam(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));

        log.info("username={}, age={}",username,age);

        response.getWriter().write("ok");
    }
}
~~~
Post Form 페이지 생성
<details>
<summary>코드</summary>
<div markdown="1">
~~~html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form action="/request-param-v1" method="post">
    username: <input type="text" name="username" />
    age: <input type="text" name="age" />
    <button type="submit">전송</button>
</form>
</body>
</html>
~~~
</div>
</details>

* GET 실행: http://localhost:8080/request-param-v1?username=hello&age=20
* POST form 실행: http://localhost:8080/basic/hello-form.html

> Jar를 사용하면 **webapp** 경로를 사용할 수 없다. 

## HTTP 요청 파라미터 - @RequestParam
스프링이 제공하는 `@RequestParam`을 사용하면 편리하게 조회 가능
~~~java
    @ResponseBody
    @RequestMapping("/request-param-v2")
    public String requestParamV2(
            @RequestParam("username") String memberName,
            @RequestParam("age") int memberAge){

        log.info("username={}, age={}",memberName,memberAge);

        return "ok";
    }


    @ResponseBody
    @RequestMapping("/request-param-v3")
    public String requestParamV3(
            @RequestParam String username,
            @RequestParam int age){

        log.info("username={}, age={}",username,age);

        return "ok";
    }

    @ResponseBody
    @RequestMapping("/request-param-v4")
    public String requestParamV4(String username, int age){
        log.info("username={}, age={}",username,age);

        return "ok";
    }

    @ResponseBody
    @RequestMapping("/request-param-required")
    public String requestParamRequired(
            @RequestParam(required = true) String username,
            @RequestParam(required = true) int age){
        log.info("username={}, age={}",username,age);

        return "ok";
    }

    @ResponseBody
    @RequestMapping("/request-param-default")
    public String requestParamDefault(
            @RequestParam(required = true, defaultValue = "guest") String username,
            @RequestParam(required = false, defaultValue = "-1") int age){
        log.info("username={}, age={}",username,age);

        return "ok";
    }
~~~

* `@RequestParam`: 파라미터 이름으로 변수 바인딩
  * @RequestParam("username") String memberName -> String membertName = request.getParameter("username)
* `@ResponseBody`: view를 조회하지 않고 HTTP message Body에 직접 내용 입력
* HTTP 파라미터 이름이 변수 이름과 같으면 @RequestParam(name="xx")에서 name="xx" 생략 가능
* String , int , Integer 등의 **단순 타입**이면 @RequestParam도 생략 가능

> 주의  
> @RequestParam 어노테이션을 생략하면 스프링 MVC는 내부에서 `required=false`를 적용한다.  

> 참고  
> @RequestParam이 있으면 명확하게 요청 파리미터에서 데이터를 읽는 다는 것을 알 수 있어 생략하는 방법은 추천하지 않는다.

### 파라미터 필수 여부
~~~java
@ResponseBody
    @RequestMapping("/request-param-required")
    public String requestParamRequired(
            @RequestParam(required = true) String username,
            @RequestParam(required = false) int age){
        log.info("username={}, age={}",username,age);

        return "ok";
    }
~~~

* required 값이 true인데 쿼리 파라미터에 username이 없으면 **400** 예외 발생
* username= 으로 요청하면 **빈 문자**가 들어온다
* int 자료형 경우 null 값을 받을 수 없어 **Integer**로 선언하거나 **defaultValue** 설정이 필요

### 기본 값 설정 
~~~java
@ResponseBody
    @RequestMapping("/request-param-default")
    public String requestParamDefault(
            @RequestParam(required = true, defaultValue = "guest") String username,
            @RequestParam(required = false, defaultValue = "-1") int age){
        log.info("username={}, age={}",username,age);

        return "ok";
    }
~~~

* 파라미터가 없거나 빈문자로 들어오면 defaultValue가 적용된다.
* 기본 값이 있기 때문에 rquired는 의미 없음

### 파라미터를 Map으로 조회
~~~java
@ResponseBody
    @RequestMapping("/request-param-map")
    public String requestParamMap(@RequestParam Map<String, Object> paramMap){
        log.info("username={}, age={}", paramMap.get("username"), paramMap.get("age"));
        return "ok";
    }
~~~

* @RequestParam **Map**
  * Map(key=value)
* @RequestParam **MultiValueMap**
  * MultiValueMap(key=[value1, value2, ...] ex) (key=userIds, value=[id1, id2])

> 파라미터 값이 1개가 확실하면 Map, 그렇지 않으면 MultiValueMap 사용

## HTTP 요청 파라미터 - @ModelAttribute
요청 파라미터를 가지고 필요한 객체를 만들어 사용할 때 스프링이 제공하는 `@ModelAttribute`를 사용하면 된다.  
요청 파라미터를 바인딩 받을 객체 생성
~~~java
@Data
public class HelloData {

    private String username;
    private int age;
}
~~~

> `@Data`: lombok이 제공하는 어노테이션으로 @Getter , @Setter , @ToString , @EqualsAndHashCode , @RequiredArgsConstructor를
자동으로 적용해준다.

### @ModelAttribute 적용 -V1
~~~java
@ResponseBody
    @RequestMapping("/model-attribute-v1")
    public String modelAttributeV1(@ModelAttribute HelloData helloData) {
        log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());

        return "ok";
    }
~~~

* HelloData 객체 생성 -> 요청 파라미터의 이름으로 HelloData의 **프로퍼티** 찾아 setter를 호출하여 파라미터 값을 입력(바인딩)
* 프로퍼티는 메소드를 통해 관리되는 데이터로 username과 age가 프로퍼티이다.
* int 타입인데 문자가 들어오면 **바인딩 오류** 발생

### @ModelAttribute 생략 -V2
~~~java
@ResponseBody
    @RequestMapping("/model-attribute-v2")
    public String modelAttributeV2(HelloData helloData) {
        log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());

        return "ok";
    }
~~~

* @ModelAttribute는 생략 가능
* String, int, Integer와 같은 **단순 타입**이면 `@RequestParam` 사용하고 그 외에는 `@ModelAttribute`
  * argument resolver 로 지정해둔 타입은 예외

## HTTP 단순 요청 메시지 - 단순 텍스트
* **HTTP messageBody**에 직접 담아서 요청  
* API에서 주로 사용하고 데이터 형식은 JSON, XML, TEXT
* 요청 파라미터와 다르게, HTTP 메시지 바디를 통해 데이터가 직접 데이터가 넘어오는 경우는 @RequestParam , @ModelAttribute를 사용할 수 없다.

### RequestBodyStringContorller
가장 단순한 텍스트를 전송하는 에제로 HTTP 메시지 바디를 `InputStream`을 통하여 읽을 수 있다.
~~~java
@Slf4j
@Controller
public class RequestBodyStringController {

    @PostMapping("/request-body-string-v1")
    public void requestBodyString(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        log.info("messageBody={}", messageBody);

        response.getWriter().write("ok");
    }
}
~~~

* Postman으로 실행: http://localhost:8080/request-body-string-v1
* Body -> raw, Text 선택하고 실행

### Input, Output Stream과 Reader
~~~java
@PostMapping("/request-body-string-v2")
public void requestBodyStringV2(InputStream inputStream, Writer responseWriter) throws IOException {

    String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

    log.info("messageBody={}", messageBody);

    responseWriter.write("ok");
}
~~~

* `InputStream(Reader)`: HTTP 요청 메시지 바디의 내용을 직접 조회
* `OutputStream(Writer)`: HTTP 응답 메시지의 바디에 직접 결과 출력

### HttpEntity
~~~java
@PostMapping("/request-body-string-v3")
public HttpEntity<String> requestBodyStringV3(HttpEntity<String> httpEntity) throws IOException {

    String messageBody = httpEntity.getBody();
    log.info("messageBody={}", messageBody);

    return new ResponseEntity<String>("ok",HttpStatus.CREATED);
}
~~~

* `HttpEntity`: HTTP header, body 정보를 편리하게 조회
  * 메시지 바디 정보를 직접 조회
  * 요청 파라미터를 조회하는 기능과 관계 없음 @RequestParam X, @ModelAttribute X
* HttpEntity는 응답에도 사용 가능
  * 메시지 바디 정보 직접 반환
  * 헤더 정보 포함 가능
  * view 조회X

* HttpEntity를 상속받은 객체도 기능 제공
  * `requestEntity`: HttpMethod, url 정보가 추가, 요청에서 사용
  * `responseEntity`: HTTP 상태 코드 설정 가능, 응답에서 사용


### @RequestBody
~~~java
@ResponseBody
@PostMapping("/request-body-string-v4")
public String requestBodyStringV4(@RequestBody String messageBody) throws IOException {

    log.info("messageBody={}", messageBody);

    return "ok";
}
~~~

## HTTP 요청 메시지 - JSON
~~~java
@Slf4j
@Controller
public class RequestBodyJsonController {

    private ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/request-body-json-v1")
    public void requestBodyJsonV1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        log.info("messageBody={}", messageBody);
        HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);
        log.info("username={}, age[{}", helloData.getUsername(), helloData.getAge());

        response.getWriter().write("ok");
    }
}
~~~

* Postman으로 실행: POST http://localhost:8080/request-body-json-v1
* raw, JSON, content-type: application/json
* HttpServletRequest로 직접 HTTP 바디에서 데이터를 읽어와 문자로 변환 하고 `objectMapper`로 JSON을 객체로 변환한다.

### @RequestBody 문자 변환
~~~java
@ResponseBody
@PostMapping("/request-body-json-v2")
public String requestBodyJsonV2(@RequestBody String messageBody) throws IOException {

    log.info("messageBody={}", messageBody);
    HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);
    log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());

    return "ok";
}
~~~

`@requestBody`를 이용하여 데이터를 읽어오고 objectMapper로 객체 변환

### @RequestBody 객체 변환
문자로 변환하고 json을 객체로 변환하는 과정이 번거로워 파라미터에 객체를 넣으면 자동 변환된다.
~~~java
@ResponseBody
@PostMapping("/request-body-json-v3")
public String requestBodyJsonV3(@RequestBody HelloData helloData) throws IOException {

    log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());

    return "ok";
}
~~~

* **HttpEntity**나 **@RequestBody**를 사용하면 `Http 메시지 컨버터`가 원하는 형태로 데이터를 변환 시켜 준다.
* JSON을 객체로 변환하는 것도 가능하다.
* `@RequestBody`는 생략 불가능
  * 생략하면 @ModelAttruibute가 적용된다.

> HTTP 요청시에 Content-Tyep이 **application/json**인지 확인해야한다.

### HttpEntity
~~~java
@ResponseBody
@PostMapping("/request-body-json-v4")
public String requestBodyJsonV4(@RequestBody HttpEntity<HelloData> httpEntity) throws IOException {
    HelloData helloData = httpEntity.getBody();
    log.info("username={}, age={}", helloData.getUsername(), helloData.getAge());
    
    return "ok";
}
~~~

### 메세지 바디 정보 직접 반환
~~~java
@ResponseBody
@PostMapping("/request-body-json-v5")
public HelloData requestBodyJsonV5(@RequestBody HelloData data) {
    log.info("username={}, age={}",data.getUsername(), data.getAge());
   
    return data; 
}
~~~


* `@RequestBody` 요청: JSON 요청 -> HTTP 메시지 컨버터 -> 객체
* `@ResponseBody` 응답: 객체 -> hTTP 메시지 컨버터 -> JSON 응답

## HTTP 응답 - 정적 리소스, 뷰 템플릿
스프링(서버)에서 응답 데이터를 만드는 방법은 크게 3가지이다.
* 정적 리소스: 주로 웹 브라우저에 정적인 HTML, css, js를 제공할 때 사용
* 뷰 템플릿: 동적인 HTML을 제공할 때 사용
* HTTP 메시지 사용: HTTP API를 사용하는 경우 데이터를 전달해야 되기 때문에 HTTP 메시지 바디에 JSON 같은 형식으로 전송

### 정적 리소스
정적 리소스는 해당 파일을 변경 없이 그대로 서비스한다.  
스프링 부트는 클래스패스의 다음 디렉토리에 있는 정적 리소스를 제공한다.
* /static, /public, /resources, /META-INF/resources
* src/main/resources는 리소스를 보관하는 곳이자 클래스 패스의 시작 경로
* src/main/resources/static에 파일이 들어있으면 http://localohst:8080/파일이름.html로 실행하면 된다.

### 뷰 템플릿
주로 동적인 HTML을 생성하는 용도로 사용
* 뷰 템플릿을 거쳐서 HTML이 생성되고 뷰가 응답을 만들어서 전달한다.
* 스프링 부트는 뷰 템플릿 경로 제공: /src/main/resources/templates

뷰 템플릿 생성
~~~html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<p th:text="${data}">empty</p>
</body>
</html>
~~~

뷰 템플릿을 호출하는 컨트롤러
~~~java
@Controller
public class ResponseViewController {

    @RequestMapping("/response-view-v1")
    public ModelAndView responseViewV1(){
        ModelAndView mav = new ModelAndView("response/hello")
                .addObject("data", "hello!");

        return mav;
    }

    @RequestMapping("/response-view-v2")
    public String responseViewV2(Model model){
        model.addAttribute("data", "hello!");
        return "response/hello";
    }

    @RequestMapping("/response/hello")
    public void responseViewV3(Model model){
        model.addAttribute("data", "hello!");
    }
}
~~~

* 반환값이 String: @ResponseBody가 있으면 http 메시지에 반환 값을 넣어 응답하지만 없으면 **뷰 리졸버**가 response/hello라는 뷰를 찾아 랜더링 한다.
* 반환값이 void: @Controller와 HTTP 메시지 바디를 처리하는 파라미터가 없으면 요청 URL을 참고해서 논리 뷰 이름으로 사용
  * 명시성이 떨어져서 권장하지 않음

스프링 부트와 호환성이 좋은 템플릿인 `Thymleaf`를 주로 사용한다.  
build.gradle
~~~
implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
~~~
의존성을 추가하면 스프링 부트가 자동으로 `ThymleafViewResolver`와 필요한 스프링 빈들을 등록한다.  

application.properties
~~~
spring.thymleaf.prefix=classpath:/templates/
spring.thymleaf.suffix=.html
~~~
기본 값으로 설정이 필요할때 변경하면 된다.

> 스프링 부트의 타임리프 관려 추가 설정에 관하여 thymleaf 검색
> https://docs.spring.io/spring-boot/docs/2.4.3/reference/html/appendix-application-properties.html#common-application-properties-templating

## HTTP 응답 - HTTP API, 메시지 바디에 직접 입력
HTML이나 뷰 템플릿을 사용해도 HTML이 응답 메시지 바디에 담겨서 전달 되지만 여기서는 정적 리소스나 뷰 템플릿을 거칙지 않고 직접 HTTP 응답 메시지에 전달하는 경우  

### ResponseBodyController
~~~java
@Slf4j
@Controller
public class ResponseBodyController {

    @GetMapping("/response-body-string-v1")
    public void responseBodyV1(HttpServletResponse response) throws IOException {
        response.getWriter().write("ok");
    }

    @GetMapping("/response-body-string-v2")
    public ResponseEntity<String> responseBodyV2() {
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

    @ResponseBody
    @GetMapping("/response-body-string-v3")
    public String responseBodyV3() {
        return "ok";
    }

    @GetMapping("/response-body-json-v1")
    public ResponseEntity<HelloData> responseBodyJsonV1() {
        HelloData helloData = new HelloData();
        helloData.setUsername("userA");
        helloData.setAge(20);

        return new ResponseEntity<>(helloData, HttpStatus.OK);
    }

    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @GetMapping("/response-body-json-v2")
    public HelloData responseBodyJsonV2() {
        HelloData helloData = new HelloData();
        helloData.setUsername("userA");
        helloData.setAge(20);

        return helloData;
    }
}
~~~

* responseBodyV1
  * 서블릿을 직접 다룰 때 처럼 HttpServletResponse 객체를 통해서 HTTP 메시지 바디에 직접 ok 응답 메시지를 전달한다.
  * response.getWriter().write("ok")
* responseBodyV2
  * ResponseEntity 엔티티는 HttpEntity 를 상속 받았는데, HttpEntity는 HTTP 메시지의 헤더, 바디 정보를 가지고 있다. ResponseEntity 는 여기에 더해서 HTTP 응답 코드를 설정할 수 있다.
  * HttpStatus.CREATED 로 변경하면 201 응답이 나가는 것을 확인할 수 있다.
* responseBodyV3
  * @ResponseBody 를 사용하면 view를 사용하지 않고, HTTP 메시지 컨버터를 통해서 HTTP 메시지를 직접 입력할 수 있다. ResponseEntity 도 동일한 방식으로 동작한다.
* responseBodyJsonV1
  * ResponseEntity 를 반환한다. HTTP 메시지 컨버터를 통해서 JSON 형식으로 변환되어서 반환된다.
* responseBodyJsonV2
  * ResponseEntity 는 HTTP 응답 코드를 설정할 수 있는데, @ResponseBody 를 사용하면 이런 것을 설정하기 까다롭다. @ResponseStatus(HttpStatus.OK) 애노테이션을 사용하면 응답 코드도 설정할 수 있다. 물론 애노테이션이기 때문에 응답 코드를 동적으로 변경할 수는 없다. 프로그램 조건에 따라서 동적으로 변경하려면 ResponseEntity 를 사용하면 된다.

### @RestController
`@RestController` 어노테이션이 붙은 컨트롤러는 @ResponseBody가 적용된다. 즉 HTTP 바디 메시지에 직접 데이터를 입력한다.  
**Rest API**를 만들때 사용

> @RestController에 들어가보면 @ResponseBody가 적용된걸 확인할 수 있다.

## HTTP 메시지 컨버터
HTTP API와 같이 데이터를 직접 HTTP 메시지 바디에 읽고 쓰는 경우 **HTTP 메시지 컨버터**를 사용하면 편리하다.

### @ResponseBody 원리
<div><img src="../../assets/images/api.PNG"></div>
@ResponseBody를 사용하게 되면 HTTP 바디에 문자 내용을 입력하고 `HttpMessageResolver`가 동작하게 된다.  

* 기본 문자 처리: `StringHttpMessageConverter`
* 기본 객체 처리: `MappingJackson2HttpMessageConverter`
* byte 처리 등등 기타 여러 컨버터도 등록 되어있다.

> 응답의 경우 클라이언트의 **HTTP Accept 헤더**와 **서버의 컨트롤러 반환 티입** 정보 둘을 조합해서 HttpMessageConverter가 선택된다.

**스프링 MVC는 다음의 경우에 HTTP 메시지 컨버터를 적용한다.**
* HTTP 요청: @RequestBody , HttpEntity(RequestEntity)
* HTTP 응답: @ResponseBody , HttpEntity(ResponseEntity)

### HTTP 메시지 컨버터 인터페이스
HTTP 요청과 응답 둘 다 사용할 수 있다.
~~~java
public interface HttpMessageConverter<T> {

	boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);
	boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

	List<MediaType> getSupportedMediaTypes();

	default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
		return (canRead(clazz, null) || canWrite(clazz, null) ?
				getSupportedMediaTypes() : Collections.emptyList());
	}

	T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException;

	void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException;
}
~~~

* `canRead()` , `canWrite()` : 메시지 컨버터가 해당 클래스, 미디어타입을 지원하는지 체크
* `read()` , `write()` : 메시지 컨버터를 통해서 메시지를 읽고 쓰는 기능

### 스프링 부트 기본 메시지 컨버터 - 일부 생략

|우선순위|메시지 컨버터|
|---|-----------|
|0|ByteArrayHttpMessageConverter|
|1|StringHttpMessageConverter|
|2|MappingJacksonHttpMessageConverter|

* `ByteArrayHttpMessageConverter` : byte[] 데이터를 처리한다.
  * 클래스 타입: byte[] , 미디어타입: */* ,
  * 요청 예) @RequestBody byte[] data
  * 응답 예) @ResponseBody return byte[] 쓰기 미디어타입 application/octet-stream
* `StringHttpMessageConverter` : String 문자로 데이터를 처리한다.
  * 클래스 타입: String , 미디어타입: */*
  * 요청 예) @RequestBody String data
  * 응답 예) @ResponseBody return "ok" 쓰기 미디어타입 text/plain
* `MappingJackson2HttpMessageConverter` : application/json
  * 클래스 타입: 객체 또는 HashMap , 미디어타입 application/json 관련
  * 요청 예) @RequestBody HelloData data
  * 응답 예) @ResponseBody return helloData 쓰기 미디어타입 application/json 관련

> */*에서 *은 **와일드 카드** 문자로 아무거나 들어와도 처리가 된다는 뜻

### HTTP 요청 데이터 읽기
HTTP 요청이 오고 컨트롤러에서 **@RequestBody**, **HttpEntity** 파라미터를 사용한다.  
1. 메시지 컨버터가 `canRead()`를 호출하여 메시지를 읽을 수 있는지 체크
   * 대상 클래스 타입과 미디어 타입 지원 체크
2. 조건을 만족하면 `read()`를  호출하여 객체를 생성하고 반환

### HTTP 응답 데이터 생성
컨트롤러에서 **@ResponseBody**, **HttpEntity**로 값이 반환된다.
1. 메시지 컨버터가 `canWrite()`를 호출해 메시지를 쓸 수 있는지 체크
   * 대상 클래스 타입과 HTTP 요청의 Accept 미디어 타입 체크 
2. 조건을 만족하면 `write()`를 호출해서 HTTP 응답 메시지 바디에 데이터를 생성

### 요청 매핑 핸들러 어댑터 구조
HTTP 메시지 컨버터는 스프링 MVC 구조에서 @RequestMapping을 처리하는 핸들러 어댑터에서 동작한다.
<div><img src="../../assets/images/blogImg/requestmapping-messageConverter.png"/></div>

어노테이션 기반의 컨트롤러가 다양한 파라미터를 처리할 수 있는 이유는 바로 `ArgumentResolver` 덕분이다.  
RequestMappingHandlerAdapter가 ArgumentResolver를 호출해서 컨트롤러가 필요한 다양한 파라미터의 값을 생성하고 컨트롤러를 호출하면서 값을 넘겨준다.  
스프링은 30개가 넘은 ArgumentResolver를 제공한다.

> 사용가능한 파라미터 목록은 공식 메뉴얼에서 확인 가능  
> https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annarguments

### ArgumentResolver
~~~java
public interface HandlerMethodArgumentResolver {

	boolean supportsParameter(MethodParameter parameter);

	@Nullable
	Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
}
~~~

**동작 방식**
1. ArgumentResolver의 supporsParameter()를 호출해서 해당 파라미터를 지원하는지 체크
2. 지원함녀 resolverArgument()를 호출해서 실체 객체 생성
3. 생성된 객체가 컨트롤러 호출시 넘어감

### ReturnValueHandler
ArgumentResolver와 비슷하게 응답 값을 변환하고 처리한다.  
컨트롤러에서 String으로 뷰 이름을 반환해도 동작하는 이유가 `ReturnValueHandler` 덕분이다.  
스프링은 10개가 넘는 ReturnValueHandler를 제공한다.

> 사용 가능한 응답 값 목록은 공식 메뉴엘에서 확인 가능  
> https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annreturn-types

## HTTP 메시지 컨버터
HTTP 메시지 컨버터 위치
<div><img src="../../assets/images/blogImg/requestmapping-messageConverter.png"/></div>

* 요청의 경우 @RequestBody를 처리하는 ArgumentResolver가 있고, HttpEntity 를 처리하는 ArgumentResolver가 있다. 이 ArgumentResolver 들이 HTTP 메시지 컨버터를 사용해서 필요한 객체를 생성하는 것이다.
* 응답의 경우 @ResponseBody 와 HttpEntity 를 처리하는 ReturnValueHandler 가 있다. 그리고 여기에서 HTTP 메시지 컨버터를 호출해서 응답 결과를 만든다.
* 스프링 MVC는 @RequestBody @ResponseBody 가 있으면 RequestResponseBodyMethodProcessor (ArgumentResolver) HttpEntity 가 있으면 HttpEntityMethodProcessor (ArgumentResolver)를 사용한다.

> HttpMessageConverter를 구현한 클래스를 확인해보면 좋다.

스프링은 다음을 모두 인터페이스로 제공한다. 따라서 필요하면 언제든지 기능을 확장할 수 있다.
* HandlerMethodArgumentResolver
* HandlerMethodReturnValueHandler
* HttpMessageConverter

그러나 확장할 일은 많지 않고 확장을 하려면 `WebMvcConfigurer`를 상속 받아서 스프링 빈으로 등록하면 된다.



