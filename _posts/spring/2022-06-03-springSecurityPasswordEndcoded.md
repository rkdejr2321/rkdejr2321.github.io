---
title: 스프링 시큐리티 암호화
excerpt: "BCryptPasswordEncoder"
autor_porfile: true
share: false
relate: false
categories:
    - springboot
---

## 스프링 시큐리티 설정
회원 가입시 사용자가 설정한 비밀번호가 DB에 그대로 저장이 되면 보안에 매우 취약하기 때문에 해쉬 암호화를 한번 진행하고 저장해야한다. 이때 많이 쓰는 방법이 `BCryptPasswordEncoder`에 encode() 메소드를 사용하는 것이다. 스프링 시큐리티에서 제공하기 때문에 의존성을 추가해야한다.  
bulid.gradled에 추가
~~~
implementation group: 'org.springframework.boot', name: 'spring-boot-starter-security'
~~~

## SecurityConfig
~~~java
@Configuration
@EnableWebSecurity
public class SpringSecurity extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception{
        http
                .cors().disable()		//cors방지
                .csrf().disable()		//csrf방지
                .formLogin().disable()	//기본 로그인 페이지 없애기
                .headers().frameOptions().disable();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
~~~

* `EnableWebSecurity`: 스프링 시큐리티 적용을 위한 어노테이션
* configure(): 스프링 시큐리티에서 제공하는 로그인 페이지 제거
* `PasswordEncoder`: 스프링 시큐리티의 **인터페이스**이며 BCrypt 해싱 알고리즘을 이용한 구현체를 스프링 빈으로 등록한다.

## 테스트 케이스
~~~java
@SpringBootTest
public class PasswordEncodedTest {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Test
    public void 비밀번호_일치_테스트() {
        Member member = new Member("hello", userService.encryptPassword("1234"), "email","pic");

        Assertions.assertThat(bCryptPasswordEncoder.matches("1234",member.getPassword())).isEqualTo(true);
    }

    @Test
    public void 같은_비밀번호_다른_해시값_테스트() {
        Member memberA = new Member("memberA", userService.encryptPassword("1234"), "email","pic");
        Member memberB = new Member("memberB", userService.encryptPassword("1234"), "email", "pic");

        assertThat(memberA.getPassword()).isNotEqualTo(memberB.getPassword()); // 값이 다르면 성공

    }
}
~~~

* `matches`로 rawPassword와 encodedPassword가 같은지 비교할 수 있다. 
* 같은 rawPassword라도 해시 값이 다르게 나온다.
