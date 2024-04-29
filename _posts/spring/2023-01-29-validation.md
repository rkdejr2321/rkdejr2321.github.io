---
title: 검증하기
excerpt: Validation
autor_porfile: true
share: false
relate: false
categories:
    - springboot
---

## 검증
만약 입력 데이터에 숫자가 들어와야 하는데 문자가 들어오면 오류 화면으로 이동한다. 이렇게 되면 사용자는 다시 되돌아가 입력을 해야하는 상황이 발생하는데 번거롭고 이런 서비스라면 사용자는 금방 떠날 가능성이 높다. 웹 서비스는 입력시 오류가 발생했다면 입력한 데이터를 유지한 상태로 어떤 오류가 발생했는지 알려주어야 한다.  
**컨트롤러의 중요한 역할중 하나는 HTTP 요청이 정상인지 검증하는 것이다.**

> 클라이언트 검증 vs 서버 검증  
> 클라이언트 검증은 조작할 수 있기에 보안에 취약하고 서버 검증은 고객 사용성이 떨어진다.   
> 둘을 적절히 섞어서 사용하되, 최종적으로 서버 검증은 필수이다.  
> API 방식에서는 API 스펙을 잘 정의해서 검증 오류를 API 응답 결과에 남겨주어야 한다.

직접 오류 메세지를 넣어 model에 담아주는 v1부터 @Validated 어노테이션을 사용하는 v6까지 점차 간결해지는 검증 방법을 알아보자.

## 검증 V1
```java
@PostMapping("/add")
public String addItem(@ModelAttribute Item item, RedirectAttributes redirectAttributes, Model model) {

    //검증 오류 결과를 보관
    Map<String, String> errors = new HashMap<>();

    //검증 로직
    //오류가 발생하면 어떤 필드에서 어떤 오류가 발생했는지 정보를 담아둔다.
    if (!StringUtils.hasText(item.getItemName())) {
        errors.put("itemName", "상품 이름은 필수입니다.");
    }
    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
        errors.put("price", "가격은 1,000원 ~ 1,000,000까지 허용합니다.");
    }
    if (item.getQuantity() == null || item.getQuantity() >= 9999) {
        errors.put("quantity", "수량은 최대 9,999R까지 허용합니다.");
    }

    //특정 필드가 아닌 복합 룰 검증
    if (item.getPrice() != null && item.getQuantity() != null) {
        int resultPrice = item.getPrice() * item.getQuantity();
        if (resultPrice < 100000) {
            errors.put("globalError", "가격 * 수량의 합은 10,0000원 이상이여야 합니다 현재 값 = " + resultPrice);
        }
    }

    //검증에 실패하면 다시 입력 폼으로 이동
    if (!errors.isEmpty()) {
        model.addAttribute("errors", errors);
        return "validation/v1/addForm";
    }

    //성공 로직
    Item savedItem = itemRepository.save(item);
    redirectAttributes.addAttribute("itemId", savedItem.getId());
    redirectAttributes.addAttribute("status", true);
    return "redirect:/validation/v1/items/{itemId}";
}
```
오류가 발생한 필드를 Key로 사용해 어떤 필드에서 어떤 오류가 발생했는지 errors에 보관하여 사용하면 오류 메세지를 출력할 수 있다.  
`StringUtils.hasText(문자열)`: 문자열이 null, 문자열의 길이가 0, 공백 문자로 이루어져 있으면 false를 반환  

검증에 실패했을 경우 `errors`와 `globalError`를 모델에 담아 뷰에 넘겨주기 때문에 적절하게 사용하면 된다.  
그러나 몇가지 문제점이 있다. 숫자 필드에 문자가 들어온 경우 스프링 MVC에서 컨트롤러에 진입 하기도 전에 예외가 발생하기 때문에 컨트롤러가 호출되지 않고 400 예외가 발생하면서 오류 페이지를 띄워준다.  
또한 입력 폼에 기존에 입력한 값을 남겨놔야 어디서 어떤 내용을 입력해 오류가 발생했는지 사용자는 알 수 있는데 타입 오류가 발생하면 바인딩에 실패해 사용자가 입력한 내용이 사라지게 된다.  
**결국 사용자가 입력한 값을 관리할 필요가 있다.**

## 검증 V2
스프링이 제공하는 `BindingResult` 객체를 사용하면 오류 내용을 보관할 수 있다.
```java
@PostMapping("/add")
public String addItemV2(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

    //검증 로직
    if (!StringUtils.hasText(item.getItemName())) {
        bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), false, null ,null,"상품 이름은 필수입니다."));
    }
    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
        bindingResult.addError(new FieldError("item", "price", item.getPrice(), false, null , null,"가격은 1,000원 ~ 1,000,000까지 허용합니다."));
    }
    if (item.getQuantity() == null || item.getQuantity() >= 9999) {
        bindingResult.addError(new FieldError("item", "quantity", item.getQuantity(), false, null, null,"수량은 최대 9,999개 까지 허용합니다."));
    }

    //특정 필드가 아닌 복합 룰 검증
    if (item.getPrice() != null && item.getQuantity() != null) {
        int resultPrice = item.getPrice() * item.getQuantity();
        if (resultPrice < 100000) {
            bindingResult.addError(new ObjectError("item", null, null, "가격 * 수량의 합은 10,0000원 이상이여야 합니다 현재 값 = " + resultPrice));
        }
    }

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v2/addForm";
    }

    //성공 로직
    ...
}
```
BindingResult가 있으면 데이터 바인딩 시 오류가 발생해도 스프링이 오류 정보(FieldError)를 생성하면서 사용자가 입력한 값을 넣어두고 해당 오류를 BindingResult에 담아서 컨트롤러를 호출한다.  
BindingResult는 Model에 자동으로 포함되기 때문에 Model을 사용하지 않아도 된다.  
**주의할 점은 @ModelAttribute가 붙은 커맨드 객체 바로 다음에 BindingReuslt가 와야한다.**

### FieldError 생성자
FieldError는 두 가지 생성자를 제공한다.
```java
public Field(String objectName, String field, String defaultMessage);

public Field(String objectName, 
             String field, 
             @Nullable Object rejectedValue,
             boolean bindingFailure, 
             @Nullable String[] codes,
             @Nullable Object[] arguments
             @Nullable String defaultMessage,
             );
```

* objectName: 오류가 발생한 객체 이름 - @ModelAttribute 객체
* field: 오류 필드
* rejectedValue: 사용자가 입력한 값 (거절된 값)
* bindingFailure: 타입 오류 같은 바인딩 실패인지, 검증 실패인지 구분 값 - 바인딩 실패면 true
* codes: 메시지 코드
* arguments: 메시지에서 사용하는 인자
* defaultMessage: 기본 오류 메시지

ObjectError도 비슷한 구조

> BindingResult와 Errors
> `BindingReuslt`는 인터페이스이고, `Errors` 인터페이스를 상속받고 있다. 실제 구현체는 `BeanPropertyBindingReuslt`인데 둘 다 구현하고 있으므로 Errors를 사용해도 상관없다. 그러나 Error는 단순한 오류 저장과 조회 기능을 제공하고 BindingResult는 추가적인 기능을 더 제공하기 때문에 주로 관례상 **BindingResult**를 많이 사용한다.


## 검증 V3
오류 메세지를 체계적으로 다루기 위해 error.properties 파일을 생성하고 메시지 설정을 추가해야 한다.  
application.properties
```properties
spring.messages.basename=messages,errors
```
errors.properties
```properties
required.item.itemName=상품 이름은 필수입니다.
range.item.price=가격은 {0} ~ {1} 까지 허용합니다.
max.item.quantity=수량은 최대 {0} 까지 허용합니다.
totalPriceMin=가격 * 수량의 합은 {0}원 이상이어야 합니다. 현재 값 = {1}
```

```java
@PostMapping("/add")
public String addItemV3(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

    //검증 로직
    if (!StringUtils.hasText(item.getItemName())) {
        bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), false, new String[]{"required.item.itemName"},null, null));
    }
    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
        bindingResult.addError(new FieldError("item", "price", item.getPrice(), false, new String[]{"range.item.price"} , new Object[]{1000, 1000000},null));
    }
    if (item.getQuantity() == null || item.getQuantity() >= 9999) {
        bindingResult.addError(new FieldError("item", "quantity", item.getQuantity(), false, new String[]{"max.item.quantity"}, new Object[]{9999},null));
    }

    //특정 필드가 아닌 복합 룰 검증
    if (item.getPrice() != null && item.getQuantity() != null) {
        int resultPrice = item.getPrice() * item.getQuantity();
        if (resultPrice < 100000) {
            bindingResult.addError(new ObjectError("item", new String[]{"totalPriceMin"}, new Object[]{10000, resultPrice}, null));
        }
    }

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v2/addForm";
    }

    //성공 로직
    ...
}
```

V2와 달라진 점은 codes와 argument를 사용했다.
* codes: 메시지 코드 - 배열로 여러 값을 전달하면 순서대로 매칭해서 처음 매칭되는 메시지를 사용
* argument: 메시지 코드의 {0}, {1}로 치환할 값을 전달한다.

## 검증 V4
FieldError, ObjectError는 파라미터가 많아 번거롭다. 컨트롤러에서 BindingResult는 검증해야 할 객체인 target 바로 다음에 오기 때문에 검증해야할 객체인 target을 알고 있다.  
BindingResult가 제공하는 `rejectValue()`, `reject()`를 사용하면 FieldError, ObjectError를 사용하지 않고 깔끔하게 검증 오류를 다룰 수 있다.

```java
@PostMapping("/add")
public String addItemV4(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes) {

    //검증 로직
    if (!StringUtils.hasText(item.getItemName())) {
        bindingResult.rejectValue("itemName", "required");
    }

    if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
        bindingResult.rejectValue("price","range", new Object[]{1000, 100000}, null);
    }
    if (item.getQuantity() == null || item.getQuantity() >= 9999) {
        bindingResult.rejectValue("quantity", "max", new Object[]{9999}, null);
    }

    //특정 필드가 아닌 복합 룰 검증
    if (item.getPrice() != null && item.getQuantity() != null) {
        int resultPrice = item.getPrice() * item.getQuantity();
        if (resultPrice < 100000) {
            bindingResult.reject("totalPriceMin", new Object[]{1000, resultPrice}, null);
        }
    }

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v2/addForm";
    }

    //성공 로직
    ...
}
```

### rejectValue()
```java
void rejectValue(
    @Nullable String feild,
    String errorCode,
    @Nullable Object[] erroArgs,
    @Nullable String defauleMessage
);
```
* field: 오류 필드명
* errorCode: 오류 코드 - 메시지에 등록된 코드가 아님
* errorArgs: 오류 메시지에서 {0}을 치환하기 위한 값
* defaultMessage: 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

BindingResult는 어떤 객체를 대상으로 검증하는지 이미 알고 있기 때문에 target에 대한 정보가 없어도 된다.

### MessageCodeResolver
"상품이 이름은 필수입니다"와 같이 오류 코드를 자세히 만들 수도 있고, "필수 값입니다."와 같이 단순하게 만들 수 있다.  
단순하게 만들면 범용성이 좋아서 여러 곳에서 사용 가능하지만 메시지를 세밀하게 작성하기 어렵다. 반대로 너무 자세하게 만들면 범용성이 떨어져 가장 좋은 방법은 범용성 있게 사용하다 필요한 경우 세밀한 내용이 적용 되도록 메시지에 **단계**를 두면 된다.
```properties
#Level1
required.item.itemName: 상품 이름은 필수입니다.

#Level2
required: 필수 값입니다.
```
required.item.itemName와 같이 객체명과 필드명을 조합한 세밀한 메시지가 있으면 이 메시지를 높은 우선순위로 사용하는 것이다.  
객체명와 필드명으로 이루어진 메시지 코드를 찾고 없으면 좀 더 범용적인 메시지를 선택하도록 스프링에서 `MessageCodesResolver`가 지원한다.  
MessageCodesResolver는 인터페이스이고 `DefaultMessageCodeResolver`는 기본 구현체이다. 주로 ObjectError, FieldError와 할께 사용한다.

```
DefaultMessageCodeResolver의 기본 메시지 생성 규칙

객체오류
1: code + "." + object name
2: code

필드오류
1.: code + "." + object name + "." + field
2.: code + "." + field
3.: code + "." + field type
4.: code
```

rejectValue(), reject()는 내부에서 MessageCodesResolver를 사용하고 여기서 메시지 코드를 생성한다. FieldError, ObjectError의 생성자를 보면, 여러 오류 코드를 가질 수 있는데 MessageCodesResolver가 생성한 순서대로 오류 코드를 보관한다. ex) String codes[]{"range.item.price", "range.price", "range.java.lang.Integer", "range"}  

> 오류 코드 관리 전략  
> **구체적인 것에서 덜 구체적인 것** 순서로 오류 코드를 만들게 되면 중요한 메시지는 구체적으로 적어서 사용하고 크게 중요하지 않은 오류 메시지니는 기존에 정의 된 것을 그냥 **재사용**하면 된다.

### ValidationUtils
ValidationUtils를 사용하면 한줄로 사용 가능하다.
```java
if (!StringUtils.hasText(item.getItemName())) {
    bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), false, new String[]{"required.item.itemName"},null, null));
}
                                                  ↓
ValidationUtils.rejectIfEmptyOrWhitespace(bindingResult, "itemName", "required");
```

ValidationUtiles는 Empty, 공백 체크 같은 단순한 기능만 제공한다.


## 검증 V5
### Validator 분리
컨트롤러에서 검증 로직이 차지하는 부분은 매우 크다. 이런 경우 별도의 클래스로 역할을 분리하면 재사용할 수 있어 좋다.  
ItemValidator
```java
@Component
public class ItemValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return Item.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Item item = (Item) target;

        //검증 로직
        if (!StringUtils.hasText(item.getItemName())) {
            errors.rejectValue("itemName", "required");
        }

        if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
            errors.rejectValue("price","range", new Object[]{1000, 100000}, null);
        }
        if (item.getQuantity() == null || item.getQuantity() >= 9999) {
            errors.rejectValue("quantity", "max", new Object[]{9999}, null);
        }

        //특정 필드가 아닌 복합 룰 검증
        if (item.getPrice() != null && item.getQuantity() != null) {
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 100000) {
                errors.reject("totalPriceMin", new Object[]{1000, resultPrice}, null);
            }
        }
    }
}
```

스프링은 검증을  체계적으로 검증하기 위해 `Validator` 인터페이스를 제공한다.
```java
public interface Validator {
    boolean supports(Class<?> clazz);
    void validate(Object target, Errors errors);
}
```

* supports(): 해당 검증기를 지원하는 여부 확인
* validate(Object target, Error errors): 검증 대상 객체와 BindingResult

```java
@PostMapping("/add")
public String addItemV5(@ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes, Model model) {

    itemValidator.validate(item, bindingResult);

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v2/addForm";
    }

    //성공 로직
    ...
}
```

## 검증 V6
체계적인 검증 기능 도입을 위해 스프링은 Validator 인터페이스를 제공한다. 검증기를 직접 불러서 사용해도 되고 Validator를 사용해도 되지만 Validator를 사용해서 검증기를 만들면 스프링의 추가적인 도움을 받을 수 있다.
### WebDataBinder
`WebDataBinder`는 스프링의 파라미터 바인딩의 역할을 해주고 검증 기능도 내부에 포함한다.  
검증기를 사용할 컨트롤러에 추가
```java
@InitBinder // 해당 컨트롤러에서만 사용 가능
public void init(WebdataBinder dataBinder) {
    dataBinder.addValidators(itemValidator);
}

@PostMapping("/add")
public String addItemV6(@Validated @ModelAttribute Item item, BindingResult bindingResult, RedirectAttributes redirectAttributes, Model model) {

    //검증에 실패하면 다시 입력 폼으로 이동
    if (bindingResult.hasErrors()) {
        return "validation/v2/addForm";
    }

    //성공 로직
    Item savedItem = itemRepository.save(item);
    redirectAttributes.addAttribute("itemId", savedItem.getId());
    redirectAttributes.addAttribute("status", true);
    return "redirect:/validation/v2/items/{itemId}";
}
```

`@Validated`은 검증기를 실행하라는 어노테이션으로 앞서 WebDataBinder에 등록한 검증기를 찾아서 실행한다. 어떤 검증기가 실행되어야 할지 구분이 필요한데 이때 supperts()가 사용된다. 이 코드에서 supports(Item.class)가 호출이 되는데 ItemValidator에서 **Item.class.isAssignableFrom(clazz)** 파라미터(Item.class)가 Item.class로 타입 변환이 가능하면 validate() 메서드가 실행된다.  

모든 컨트롤러에 설정하려면 설정 클래스에서 WebMvcConfigure의 getValidator() 메서드가 Validator 구현 객체를 리턴하도록 구현하면 된다.
```java
@SpringBootApplication
public class ItemServiceApplication implements WebMvcConfigurer {
    public static void main(String[] args) {
        SpringApplication.run(ItemServiceApplication.class, args);
    }

    @Override
    public Validator getValidator() {
        return new ItemValidator();
    }
}
```

> 글로벌 설정을 하면 BeanValidator가 자동 등록되지 않고 글로벌 설정을 직접 사용하는 경우는 드물다.  
  
> `@Validated`, `@Valid` 둘 다 사용가능하다.  
> javax.validation.@Valid 를 사용하려면 build.gradle 의존관계 추가가 필요하다.
> ```
>implementation 'org.springframework.boot:spring-boot-starter-validation'
>```
> @Validated 는 **스프링 전용** 검증 애노테이션이고, @Valid는 **자바 표준** 검증 애노테이션이다.