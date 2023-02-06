---
title: 어노테이션으로 검증하기
excerpt: Bean Vadlidation
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

## Bean Validation이란?
검증 기능은 대부분 null 값인지 특정 범위에 만족하는지 등 매우 일반적인 로직이다. 매번 검증 로직 코드를 작성하는 것은 상당히 번거로운데 스프링은 어노테이션 하나로 검증 로직을 적용할 수 있는 `Bean Valdiation`을 제공한다.  
* 특정 구현체가 아닌 **Bean Validatoin 2.0(JSR-380)**이라는 표준 기술
* JPA가 표준 기술이고 그 구현체로 하이버네이트가 있는 것 처럼 Bean Validation은 검증 어노테이션과 여러 인터페이스의 모음
* Bean Validatoin을 구현한 기술 중에 일반적으로 사용하는 구현체는 **하이버네이트 Validation**인데 ORM과 관련 없다.

> 하이버테이트 Validator 관련 링크  
> 자세한 내용은 아래 링크에서 확인 가능  
> [공식 사이트](http://hibernate.org/validator/), [공식 메뉴얼]( https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/), [검증 어노테이션 모음](https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/#validator-defineconstraints-spec)

## Bean Validation 적용
Bean Validation을 사용하려면 우선 build.gradle에 라이브러리를 추가해야한다.
```gradle
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

```java
@Data
public class Item {

    private Long id;

    @NotBlank(groups = {SaveCheck.class, UpdateCheck.class})
    private String itemName;

    @NotNull
    @Range(min = 1000, max = 1000000)
    private Integer price;

    @NotNull
    @Max(9999)
    private Integer quantity;
}
```

* @NotBlank: 빈 값과 공백만 있는 경우 허용하지 않는다.
* @NotNull: null을 허용하지 않는다.
* @Range(min = 1000, max = 10000): min과 max 범위 안의 값이어야 한다.
* @Max(9999): 최대 값 까지 허용한다.

```java
@PostMapping("/add")
public String addItem(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

    //특정 필드가 아닌 복합 룰 검증
    if (item.getPrice() != null && item.getQuantity() != null) {
        int resultPrice = item.getPrice() * item.getQuantity();
        if (resultPrice < 100000) {
            bindingResult.reject("totalPriceMin", new Object[]{1000, resultPrice}, null);
        }
    }

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v3/addForm";
    }

    //성공 로직
    ...
}
```

검증할 객체 앞에 `@Validate` 어노테이션을 붙여주면 검증기가 동작한다. 스프링 부트가 spring-boor-starter-validation 라이브러리를 넣으면 자동으로 Bean Validator를 인지하고 스프링에 통합한다.  
`LocalValidatorFactoryBean`을 글로벌 Validator로 등록하고 이 Validator는 어노테이션을 보고 검증을 수행하기 때문에 @Valid, @Validation만 적용하면 된다. 만약 검증 오류가 발생하면, FieldError, ObjectError를 생성해서 BindingResult에 담아준다.

> 주의할 점은 직접 검증기를 만들어 글로벌 Validator로 등록하면 스프링 부트는 Bean Validator를 등록하지 않아 어노테이션 기반의 빈 검증기가 동작하지 않는다.  
> @Valid, @Validated 모두 사용 가능하지만 @Validated는 내부에 `groups`라는 기능을 포함하고 있다.


검증 순서는 먼저 @ModelAttribute 각각의 필드에 타입 변환을 시도한다. 성공하면 Validator를 적용하고 실패하면 typeMismatch로 FieldError에 추가한다. 즉, 바인딩에 성공해야지 Bean Validator가 동작하고 타입 변환에 실패해서 바인딩이 되지 않는 경우는 적용하지 않는다.

## Bean Validation의 에러 코드
Bean Validation을 적용하고 검증 오류 코드를 확인해 보면 MessageCodesResolver를 통해 다양한 메시지 코드가 순서대로 생성된다.
```
ex
@NotBlank
* NotBlank.item.itemName
* NotBlank.item
* NotBlank.java.lang.String
* NotBlank
```

errors.properties에 메시지를 등록하여 적용할 수 있다.
```properties
NotBlank={0} 공백 X
Range={0}, {2} ~ {1} 허용
...
```
{0}은 필드명 {1}, {2}...는 각 어노테이션마다 다르다.

### Bean Validation 메시지 찾는 순서
1. 생성된 메시지 코드를 순서대로 messsageSource에서 찾기
2. 어노테이션의 message 속성 사용
3. 라이브러리가 제공하는 기본 값 사용

```java
//어노테이션 message 사용 예시
@NotBlank(message = "공백은 입력할 수 없습니다.")
private String itemName;
```

## Bean Validatoin의 오브젝트 오류
오브젝트 오류는 `@ScriptAssert()`를 사용하면 된다.
```java
@Data
@ScriptAssert(lang = "javascript", script = "_this.price * _this.quantity >= 100000")
public class Item{
    ...
}
```

실제 사용해보면 제약이 많고 복잡하다. 실무에서 검증이 해당 객체의 범위를 넘어서는 경우들도 종종 등장하는데, 그런 경우 대응이 어렵다. 따라서 @ScriptAssertf를 사용하는 것 보다 직접 자바 코드로 작성하는걸 권장한다.
```java
//특정 필드가 아닌 복합 룰 검증
if (item.getPrice() != null && item.getQuantity() != null) {
    int resultPrice = item.getPrice() * item.getQuantity();
    if (resultPrice < 100000) {
        bindingResult.reject("totalPriceMin", new Object[]{1000, resultPrice}, null);
    }
}
```

## Bean Validation의 한계
데이터를 등록할 때와 수정할 때 요구사항이 다를 수 있다. 여러 기능에서 동일한 모델 객체를 사용할 경우 검증 조건이 충돌해 Bean Validatoin을 적용할 수 없다. 이런 경우 앞서 말한 `groups` 기능을 사용하거나 ItemSaveForm, ItemUpdateForm... 같은 별도 모델 객체를 만들어 사용하면 된다.
### groups 적용
저장하기 위한 groups를 생성해야 한다.
```java
public interface SaveCheck{
}

public interface UpdateCheck{
}
```

```java
@Data
public class Item {

    @NotNull(groups = UpdateCheck.class) //수정 요구사항 추가
    private Long id;

    @NotBlank(groups = {SaveCheck.class, UpdateCheck.class})
    private String itemName;

    @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
    @Range(min = 1000, max = 1000000)
    private Integer price;

    @NotNull(groups = {SaveCheck.class, UpdateCheck.class})
    @Max(value = 9999, groups = SaveCheck.class)
    private Integer quantity;
}
```

```java
@PostMapping("/add")
public String addItem(@Validated(SaveCheck.class) @ModelAttribute Item item, 
                        BindingResult bindingResult, 
                        RedirectAttributes redirectAttributes) {
    ...
}

@PostMapping("/{itemId}/edit")
public String editItem(@PathVariable Long itemId, 
                     @Validated(UpdateCheck.class) @ModelAttribute Item item, 
                     BindingResult bindingResult) {
    ...
}
```

groups 기능을 사용하면 하나의 모델 객체를 사용하더라도 등록과 수정에서 각각 다른 검증 기능을 수행한다.  
그러나 groups는 실제로 잘 사용하지 않는데, 그 이유는 실무에서 주로 별도의 폼 객체를 분리해서 사용하기 떄문이다.

## Form 전송 객체 분리
groups 기능을 사용하지 않는 이유는 등록, 수정 등 여러 상황에서 전달하는 데이터가 도메인 객체와 딱 맞지 않는다. 간단한 예제는 딱 맞아 떨어지지만 실무에서는 회원 가입시 회원에 대한 정보 뿐만아니라 약관 정보와 같은 회원과 관계 없는 수많은 부가 데이터가 넘어오기 떄문이다.  
도메인 객체를 전달 받는 것이 아니라 폼 데이터를 컨트롤러까지 전달할 별도의 객체를 만들어 @ModelAttriute로 사용해 컨트롤러에서 폼 데이터를 전달 받고 필요한 데이터를 사용해 도메인 객체를 생성한다.

```java
@Data
public class ItemSaveForm {

    @NotBlank
    private String itemName;

    @NotNull
    @Range(min = 1000, max = 100000)
    private Integer price;

    @NotNull
    @Max(9999)
    private Integer quantity;
}
```

```java
@PostMapping("/add")
    public String addItem(@Validated @ModelAttribute("item") ItemSaveForm form, 
                          BindingResult bindingResult, 
                          RedirectAttributes redirectAttributes) {

        //특정 필드가 아닌 복합 룰 검증
        if (form.getPrice() != null && form.getQuantity() != null) {
            int resultPrice = form.getPrice() * form.getQuantity();
            if (resultPrice < 100000) {
                bindingResult.reject("totalPriceMin", new Object[]{1000, resultPrice}, null);
            }
        }

        //검증에 실패하면 다시 입력 폼으로 이동
        if (bindingResult.hasErrors()) {
            return "validation/v4/addForm";
        }

        //성공 로직
        //Item 객체로 변환
        Item item = new Item();
        item.setItemName(form.getItemName());
        item.setPrice(form.getPrice());
        item.setQuantity(form.getQuantity());

        Item savedItem = itemRepository.save(item);
        redirectAttributes.addAttribute("itemId", savedItem.getId());
        redirectAttributes.addAttribute("status", true);
        return "redirect:/validation/v4/items/{itemId}";
    }
```

ItemSaveForm을 전달 받고 @Validated로 검증 수행 후 BindingResult에 검증 결과를 담는다.

## Bean Validation - HTTP 메시지 컨버터
@Valid와 @Validated는 `HttpMessageConverter`에도 적용할 수 있다. 즉, API JSON 요청에서 HTTP Body의 데이터를 객체로 변환할 때도 동일한 검증 기능을 사용 가능하다.
```java
@Slf4j
@RestController
@RequestMapping("/validation/api/form")
public class ValidationItemApiController {

    @PostMapping("/add")
    public Object addItem(@RequestBody @Validated ItemSaveForm form, BindingResult bindingResult) {
        
        log.info("컨트롤러 호출");
        
        if (bindingResult.hasErrors()) {
            log.info("검증 오류 발생={}",bindingResult);
            return bindingResult.getAllErrors();
        }

        log.info("성공 로직 실행");

        return form;
    }
}
```
API는 3가지의 경우를 나누어 생각해야 한다.
* 성공 요청: 성공
* 실패 요청: JSON을 객체로 생성하기 실패
* 검증 오류 요청: JSON을 객체로 생성했지만 검증에서 실패
  
실패 요청은 HttpMessageConverter에서 요청 JSON을 ItemSaveForm 객체로 생성하는데 실패 했기 때문에 컨트롤러 자체가 호출되지 않고 예외가 발생한다.

> **@ModelAttribute vs @RequestBody**  
> @ModelAttribute는 **필드 단위**로 정교하게 바인딩이 적용된다. 특정 필드가 바인딩 되지 않아도 나머지 필드는 정상 바인딩 되고 검증을 적용할 수 있다.  
> @RequestBody는 HttpMessageConverter 단계에세 JSON 데이터를 객체로 변격하지 못하면 컨트롤러도 호출 되지 않고 검증을 적용할 수 없다.
