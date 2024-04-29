---
title: ArgumentResolver
excerpt: ArgumentResolver
autor_porfile: true
share: false
relate: false
categories:
    - springboot
---

## ArgumentResolver란?
`ArguemtResolver`는 HTTP 요청이 들어올 때 컨트롤러가 필요한 파라미터 객체를 요청 데이터를 기반으로 생성해준 후 컨트롤러를 호출하면서 값을 전달해준다. HttpServletRequest, Model은 물론이고 @RequestParam, @ModelAttribute와 같은 어노테이션 그리고 @RequestBody, HttpEntity와 같은 Http 메시지를 처리하는 부분도 지원한다. 스프링에서는 30개가 넘은 ArgumentResolver를 지원하지만 스프링에서 제공하는 객체 이외에 특정 객체가 올바른 요청에 의해 사용되어야 하는지 검증하기 위해서 ArgumentResolver를 사용할 수도 있다.

> 스프링에서 제공하는 ArgumentResolver는 [공식 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-annarguments)에서 참고하면 된다.

## 예제 코드
예제로는 요청한 사용자의 로그인 여부를 확인하기 위해 세션이 있다면 세션에 있는 로그인 회원을 찾아주고, 세션이 없다면 null을 반환해주는 @Login 어노테이션을 만들어서 컨트롤러에 적용한다.

### 어노테이션 생성
```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {
}
```

* `@Target()`: 어노테이션이 붙을 수 있는 타입 지정
* `@Retention()`: 어노테이션의 라이프 사이클을 지정

### ArgumentResolver 구현
```java
@Slf4j
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        log.info("supportsParameter 실행");

        boolean hasParameterAnnotation = parameter.hasParameterAnnotation(Login.class);
        boolean hasMemberType = Member.class.isAssignableFrom(parameter.getParameterType());

        return hasParameterAnnotation && hasMemberType;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        log.info("resolverArgument 실행");

        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }

        return session.getAttribute(SessionConst.LOGIN_MEMBER);
    }
}
```

* `hasParameterAnnotation()`: 파라미터에 해당 클래스 어노테이션이 붙어 있으면 true, 아니면 false 반환
* `isAssignableFrom()`: 특정 클래스와 파라미터의 클래스가 같으면 true, 아니면 false 반환
* `supportsParameter`: 파라미터에 해당 클래스 어노테이션이 붙어 있고 파라미터가 해당 클래스 타입이면(true) resolveArguemet() 실행, false면 실행하지 않는다.
* `resolverArgument()`: 컨트롤러 호출 직전에 호출 되어서 파라미터에 필요한 정보를 생성해준다.

컨트롤러 파라미터에 @Login이 붙은 Member 객체가 있으면 hasParameterAnnotation 메소드가 true고 isAssignableForm 메소드도 true이기 때문에 resolveArgument가 실행된다. resolverArgument에서 session을 찾고 session이 비어있으면 null, 세션이 있으면 로그인 회원 정보인 Member 객체를 찾아 반환 해준다. 이후 스프링MVC는 컨트롤러의 메스드를 호출하면서 resolveArgument가 반환한 객체를 파라미터에 전달해준다.  

### WebConfigurer에 등록
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new LoginMemberArgumentResolver());
 }
}
```

### 컨트롤러에 적용
```java
@GetMapping("/")
public String homeLoginV3ArgumentResolver(@Login Member loginMember, Model model) {

    //세션에 회원 데이터가 없으면 home
    if (loginMember == null) {
        return "home";
    }

    //세션이 유지되면 로그인으로 이동
    model.addAttribute("member", loginMember);
    return "loginHome";
}
```
컨트롤러에서 로그인한 사용자를 체크하는 중복 로직을 없애고 어노테이션 적용으로 한번에 해결할 수 있다. 또한 로그인 사용자를 체크하는 로직이 변경 될 경우 LoginMemberArgumentResolver의 로직만 변경해주면 되기 때문에 효율적이다.
