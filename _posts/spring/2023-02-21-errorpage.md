---
title: 예외처리와 에러페이지
excerpt: Error Page
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

## 예외 처리
사용자가 잘못된 경로에 요청을 보내거나 서버 내부의 오류가 발생 했을 경우 문제가 생겼다는 오류 페이지를 한번쯤 봤을 것이다. 순수 서블릿 컨테이너가 예외 처리하는 방식을 알아보고 스프링 부트가 얼마나 편하게 지원해주는지 알아본다.

## 서블릿 예외 처리
서블릿은 2가지 방식으로 예외 처리를 지원한다.
* Exception(예외)
* response.sendError(Http 상태코드, 오류 메시지)

### Exception(예외)
웹 애플리케이션은 사용자 요청별로 별도의 쓰레드가 할당 되고 서블릿 컨테이너 안에서 실행된다. 애플리케이션에서 예외가 발생해 try~catch로 처리하면 문제가 없지만 만약 예외를 잡지 못한다면 WAS까지 예외가 전달된다.
```
WAS <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
```

서블릿에서 예외 처리하는 방식을 확인하기 위해 스프링 부트에서 제공하는 기본 예외 페이지를 꺼야한다.
```properties
server.error.whitelable.enable=false
```

```java
@Controller
public class ServletExController {

    @GetMapping("error-ex")
    public void errorEx() {
        throw new RuntimeException("예외 발생!");
    }
}
```
<div><img src = "../../assets/images/blogImg/servlet500.png"/></div>
localhost:8080/error-ex에 접속하면 톰캣이 제공하는 기본 오류 화면을 확인할 수 있다.

### response.sendError()
HttpServletResposne가 제공하는 `sendError` 메서드를 사용해도 된다. 호출한다고 당장 예외가 발생하는 것은 아니지만 서블릿 컨테이너에 오류가 발생헀다는 점을 전달할 수 있고 HTTP 상태코드와 오류 메시지도 추가할 수 있다.

```java
@Slf4j
@Controller
public class ServletExController {

    @GetMapping("error-404")
    public void error404(HttpServletResponse response) throws IOException {
        response.sendError(404, "404 오류!");
    }

    @GetMapping("error-500")
    public void error500(HttpServletResponse response) throws IOException {
        response.sendError(500);
    }
}
```
```
WAS(sendError 호출 기록 확인) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러
```
sendError를 호출하면 resposne 내부에는 오류가 발생했다는 상태를 저장해두고 서블릿 컨테이너는 응답 전에 response에 sendError()가 호출 되었는지 확인한다. 만약 호출 되었다면 설정한 오류 코드에 맞는 기본 오류 페이지를 보여준다.

### 서블릿 오류 화면 제공
앞서 확인한 서블릿이 기본적으로 제공하는 오류 페이지는 사용자 입장에서 보기 안좋다. 서블릿이 제공하는 오류 화면 기능을 사용하면 친절한 오류 화면을 사용자에게 보여준다.  
과거에는 web.xml 파일에 오류 화면을 등록했지만 스프링 부트를 통해서 서블릿 컨테이너를 실행하기 떄문에 스프링 부트가 제공하는 기능을 사용해서 서블릿 오류 페이지를 등록하면 된다.
```java
@Component
public class WebServerCustomizer implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    @Override
    public void customize(ConfigurableWebServerFactory factory) {

        ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND, "/error-page/404");
        ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error-page/500");
        ErrorPage errorPageEx = new ErrorPage(RuntimeException.class, "/error-page/500");

        factory.addErrorPages(errorPage404, errorPage500, errorPageEx);
    }
}
```
예를 들어 404 에러를 응답하면 errorPage404를 호출해 error-page/404로 요청을 보낸다. 컨트롤러에서 error-page/404에 대한 요청을 받아 오류 화면을 다시 응답해주면 내가 원하는 오류 페이지를 사용자에게 전달할 수 있다.
```java
@Slf4j
@Controller
public class ErrorServletController {

    @RequestMapping("/error-page/404")
    public String errorPage404(HttpServletRequest request, HttpServletResponse response) {
        log.info("error-page 404");
        return "error-page/404";
    }

    @RequestMapping("/error-page/500")
    public String errorPage500(HttpServletRequest request, HttpServletResponse response) {
        log.info("error-page 500");
        return "error-page/500";
    }
}
```
template/error-page 디렉토리를 만들고 404.html과 500.html을 만들어 실행하면 설정한 오류 페이지가 정상 노출되는 것을 확인할 수 있다.

### 서블릿 오류 페이지 작동 원리
서블릿은 Eception이 발생해서 서블릿 밖으로 전달된거나 response.sendError가 호출 되었을 때 설정된 오류 페이지를 찾는다.

```
1. WAS(여기까지 전파) <- 필터 <- 서블릿 <- 인터셉터 <- 컨트롤러(예외발생)
2. WAS `/error-page/500` 다시 요청 -> 필터 -> 서블릿 -> 인터셉터 -> 컨트롤러(/errorpage/500) -> View
```
예외가 WAS까지 전달되고 WAS는 오류페이지 경로를 찾아서 내부에서 오류 페이지를 호출하는데 이때 오류 페이지 경로로 필터, 서블릿, 인터셉터, 컨트롤러가 다시 호출된다. 오류 페이지를 호출할 때 단순히 다시 요청만 하는게 아니라 오류 정보를 request의 attribute에 담아 넘겨준다.
```java
@Slf4j
@Controller
public class ErrorServletController {

    //RequestDispatcher 상수로 정의되어 있음
    public static final String ERROR_EXCEPTION = "javax.servlet.error.exception";
    public static final String ERROR_EXCEPTION_TYPE = "javax.servlet.error.exception_type";
    public static final String ERROR_MESSAGE = "javax.servlet.error.message";
    public static final String ERROR_REQUEST_URI = "javax.servlet.error.request_uri";
    public static final String ERROR_SERVLET_NAME = "javax.servlet.error.servlet_name";
    public static final String ERROR_STATUS_CODE = "javax.servlet.error.status_code";

    @RequestMapping("/error-page/404")
    public String errorPage404(HttpServletRequest request, HttpServletResponse response) {
        log.info("error-page 404");
        printErrorInfo(request);
        return "error-page/404";
    }

    @RequestMapping("/error-page/500")
    public String errorPage500(HttpServletRequest request, HttpServletResponse response) {
        log.info("error-page 500");
        printErrorInfo(request);
        return "error-page/500";
    }

    private void printErrorInfo(HttpServletRequest request) {
        log.info("ERROR_EXCEPTION: {}", request.getAttribute(ERROR_EXCEPTION));
        log.info("ERROR_EXCEPTION_TYPE: {}", request.getAttribute(ERROR_EXCEPTION_TYPE));
        log.info("ERROR_MESSAGE: {}", request.getAttribute(ERROR_MESSAGE));
        log.info("ERROR_REQUEST_URI: {}", request.getAttribute(ERROR_REQUEST_URI));
        log.info("ERROR_SERVLET_NAME: {}", request.getAttribute(ERROR_SERVLET_NAME));
        log.info("ERROR_STATUS_CODE: {}", request.getAttribute(ERROR_STATUS_CODE));

        log.info("dispatcher Type={}", request.getDispatcherType());
    }
}
```
* `javax.servlet.error.exception` : 예외
* `javax.servlet.error.exception_type` : 예외 타입
* `javax.servlet.error.message` : 오류 메시지
* `javax.servlet.error.request_uri` : 클라이언트 요청 URI
* `javax.servlet.error.servlet_name` : 오류가 발생한 서블릿 이름
* `javax.servlet.error.status_code` : HTTP 상태 코드

### 서블릿 예외 처리 - 필터
오류가 발생하면 WAS 내부에서 다시 호출이 발생하고 이때 필터, 서블릿, 인터셉터도 모두 다시 호출된다. 이미 필터나 인터셉터로 로직을 체크했는데 오류가 났다고 한번 더 호출 되는 것은 비효율이기 때문에 클라이언트로 부터 발생한 정상 요청인지 오류 페이지를 출력하기 위한 내부 요청인지 구분할 필요가 있는데 서블릿은 `DispatcherType` 이라는 추가 정보를 제공한다.

```java
public enum DispatcherType {
    //클라이언트 요청
    FORWARD,
    //서블릿에서 서블릿이나 JSP 호출
    INCLUDE,
    //서블릿에서 서블릿이나 JSP의 결과를 포함할 떄
    REQUEST,
    //서블릿 비동기 호출
    ASYNC,
    //오류 페이지 호출
    ERROR
}
```
만약 필터를 오류 페이지 요청에만 쓰고 싶다면 필터를 등록한 WebConfiguration에서 `filterRegistrationBean.setDispatcherTypes()`를 설정해주면 된다.
```java
@Bean
public FilterRegistrationBean logFilter() {
    FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LogFilter());
    filterRegistrationBean.setOrder(1);
    filterRegistrationBean.addUrlPatterns("/*");
    
    //클라이언트 요청과 오류 페이지 요청에 필터 적용
    filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ERROR);

    return filterRegistrationBean;
}
```

### 서블릿 예외 처리 - 인터셉터
인터셉터는 서블릿이 제공하는 기술이 아닌 스프링이 제공하는 기술이기 때문에 DispathcerType과 무관하게 항상 호출된다. 대신에 인터셉터는 요청 경로를 추가하거나 제외하기 쉽게 되어 있기 때문에 `excludePathPattern`에서 오류 페이지 경로를 제외해주면 된다.
```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LogInterceptor())
            .order(1)
            .addPathPatterns("/**")
            .excludePathPatterns("/css/**", "*.ico", "/error", "error-page/**");
}
```

## 스프링 부트 예외 처리
서블릿은 매우 복잡한 과정을 거쳐 WebServerCustomizer를 만들고 ErrorPage를 추가하고 예외 처리 컨트롤러를 만들어서 처리했다. 그러나 스프링 부트는 이런 과정을 모두 제공해준다.  
스프링 부트가 제공하는 오류 페이지 기능을 확인해보려면 WebServerCustomizer를 적용하면 안된다.
* ErrorPage 자동 등록
  * /error라는 경로로 기본 오류 페이지를 설정 -> 서블릿 밖으로 예외가 발생하거나 response.sendError가 호출되면 /error를 호출하게 된다.
* `BasicErrorController` 자동 등록
  * ErrorPage에서 등록한 /error를 처리하는 컨트롤러

> 참고  
> `ErrorMvcAutoConfiguration`이라는 클래스가 오류 페이지를 자동으로 등록하는 역할을 한다.

### 뷰 선택 우선 순위
**BasicErrorController**는 기본적인 로직이 모두 개발되어 있다. 개발자는 룰과 우선순위에 따라서 정적 리소스, 뷰 템플릿 경로에 오류 페이지 파일을 만들어서 넣어두기만 하면 된다.  
오류 페이지 파일 이름은 HTTP 상태 코드.html로 만들면 되고 4xx.html로 만들게 되면 400,401,402...등 400번대 오류를 처리해준다.
1. 뷰 템플릿
   * resources/template/error/400.html
2. 정적 리소스
   * resources/static/error/400.html
3. 적용 대상 없을 때 뷰 이름 error
   * resources/templates/error.html

뷰 템플릿, 정적 리소스보다 우선 순위가 높고 404, 500처럼 구체적인 것이 4xx, 5xx처럼 덜 구체적인 것 보다 우선 순위가 높다.

### BasicErrorController가 제공하는 정보
BasicErrorController는 model에 정보를 담아서 뷰에 전달하기 떄문에 뷰 템플리셍서 이런 값을 활용할 수 있다.
```
timestamp: Fri Feb 05 00:00:00 KST 2021
status: 400
error: Bad Request
exception: org.springframework.validation.BindException
trace: 예외 trace
message: Validation failed for object='data'. Error count: 1
errors: Errors(BindingResult)
path: 클라이언트 요청 경로 (`/hello`)
```

물론 클라이언트에게 이러한 정보를 제공하지 않는 것이 좋다. 일반 사용자는 무슨 말인지 모르는 경우가 대부분이고 특히 보안상의 이유가 더 크다. 디버그를 위해 개발 서버에서 사용할 수 있으나 운영 서버에서 사용하는 건 권장하지 않는다. application.properties에서 model에 담을지 말지 설정할 수 있다.
```properties
server.error.include-exception=true
server.error.include-message=on_param
server.error.include-stacktrace=on_param
server.error.include-binding-errors=on_param
```

3가지 옵션이 있다.
* `never`: 사용하지 않음(기본 값)
* `always`: 항상
* `on_param`: 파라미터가 있을 때 사용
  * message=&errors=&trace=를 HTTP 요청시 전달하면 정보들이 model에 담긴다.

> 실무에서는 사용자들에게 이해하기 쉽고 예쁜 오류 화면을 제공하고 로그는 서버에 남겨 확인해야 한다.

### 스프링 부트 오류 관련 옵션
* `server.error.whitelabel.enable=true`: 오류 처리 화면을 못찾을 시 스프링이 제공하는 **whitelabel** 오류 페이지 적용
* `server.error.path:/error`: 오류 페이지 경로 지정

> 만약 에러 공통 처리 컨트롤러의 기능을 변경하고 싶으면 ErrorController나 BasicErrorController를 상속 받아서 기능을 추가하면 된다.
