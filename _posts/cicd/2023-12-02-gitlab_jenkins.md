---
title: 깃랩과 젠킨스 CI/CD 파이프라인 구축
excerpt: "GitLab & Jenkins for CI/CD"
autor_porfile: true
categories:
    - CI-CD
share: false
related: false
---

# 개요

매번 개발자가 코드를 수정하면 코드를 합치고 빌드 → 테스트 → 배포를 한다면 상당히 많은 시간이 소요될 뿐만 아니라 효율성이 떨어진다. 이런 과정을 자동화할 수 있는 아키텍쳐가 바로 `CI/CD`다.

### CI란?

**`Continuous Integration`** 즉, 지속적인 통합이라는 뜻으로 어플리케이션의 **새로운 코드 변경 사항이 정기적으로 빌드 및 테스트 되어공유 레포지토리에 통합히는 것**을 의미한다.

### CD란?

`Continuous Delivery` , `Continuous Depolyment`  즉, 지속적인 서비스 제공, 지속적인 배포라는 뜻으로 

Continuous Delivery는 **공유 레포지토리로 자동으로 Release** 하는 것, Continuous Deployment는 **Production 레벨까지 자동으로 deploy** 하는 것을 의미한다.

### 실습 아키텍처

3개의 VM을 사용하여 각각 Gitlab, Jenkins, WAS를 설치하고 연결한다.
<div><img src = "../../assets/images/blogImg/ci:cd_pipline.png"/></div>

<aside>
💡 Gitlab은 프로젝트 팀에서 한 개만 구축해서 실습해야되기 때문에 본 레포트에는 설치 과정이 없다.

</aside>

### Docker 설치

Gitlab과 Jenkins를 `docker`와 `docker-compose`를 이용해 설치한다.

Gitlab과 Jenkins를 설치할 VM에 아래 명령어를 이용해 docker를 설치.

```bash
yum -y update
yum install -y yum-utils

# docker Repository를 시스템에 추가
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum-config-manager --enable docker-ce-nightly

#docker 설치
yum -y install docker-ce docker-ce-cli containerd.io

#docker 실행
systemctl start docker
systemctl enable docker

#docker 상태 확인
systemctl status docker
```

# CI 구축

### Jenkins 설치

먼저 젠킨스를 설치할 VM에 접속한다.

```bash
ssh root@<VM ip 주소>
```

해당 VM의 password를 입력하면 접속 완료.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_1.png"/></div>

아래 명령어로 jenkins의 도커 이미지를 검색한다.

```bash
docker search jenkins
```

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_2.png"/></div>

STARS가 가장 많고 공식 이미지인 첫번째 Jenkins 이미지를 설치.

```bash
docker pull jenkins/jenkins:lts
```

다운받은 이미지를 실행 후 docker 프로세스 확인.

```bash
#이미지 실행
docker run -d -p 8181:8080 --restart=always --name my_jenkins -u root jenkins/jenkins:lts

#docker 확인
docker ps -a
```

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_3.png"/></div>

http://<VM ip주소>:8181로 접속하면 Jenkins 초기 설정 화면이 나온다.

Administrator password는 jenkins bash에 접속하여 `/var/jenkins_home/secrets/initialAdminPassword`  해당 파일에서 확인할 수 있다.

```bash
#vim 설치
apt-get update
apt-get install vim

#jenkins bash 접속
docker exec -it my_jenkins /bin/bahs

#vi 편집기로 password 확인
vim /var/jenkins_home/secrets/initialAdminPassword
```

password를 복사해서 입력하고 진행.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_4.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_5.png"/></div>

Install suggetsted plugins를 눌러 자동으로 설치 진행한다.

설치가 완료되면  관리자 설정을 진행.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_6.png"/></div>

로그인 후 초기화면으로 들어왔다면 설치는 완료 되었다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_7.png"/></div>

### Gitlab 레포지토리 생성

http://<Gitlab이 설치되어 있는 VM ip주소>:9090으로 접속하면 해당 화면이 나온다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_8.png"/></div>

New Project를 클릭해 생성

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_9.png"/></div>

프로젝트 이름과 Visiblity Level을 설정하고 create project

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_10.png"/></div>

프로젝트가 생성되었으면 로컬 PC에서 소스코드를 수정하고 원격 레포지토리에 push 할 수 있게 git clon으로 레포지토리를 가져온다.

```bash
git clone <원격 Repository 주소>
```

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_11.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_12.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_13.png"/></div>

로컬 저장소와 원격 저장소가 연결 되어있는지 확인하기 위해 아래 명렁어를 입력해서 origin이 있는지 확인한다.

```bash
git remote -v
```

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_14.png"/></div>

현재 변경사항이 없기 때문에 commit이 불가능하다. 연결이 되어있는지 확인하기 위해 변경사항이 없는 빈 커밋을 만들어 push한다.

```bash
git commit --allow-empty -m 'first commit'

git push origin main
```

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_15.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_16.png"/></div>

잘 연결된걸 확인할 수 있다.

### Gitlab과 Jenkins 연동

먼저 Gitlab, Git 관련 플러그인을 설치 해야한다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_17.png"/></div>

설치 가능한 plugin에서 gitlab을 찾아 설치

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_18.png"/></div>

설치된 plugin 목록에서 Git plugin, GitLab plugin인을 확인

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_19.png"/></div>

새로운 Item 메뉴에서 프로젝트 생성

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_20.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_21.png"/></div>

Repository 탭에서 깃랩 레포지토리 주소를 붙여 넣는다 이때 9090포트를 추가해야 한다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_22.png"/></div>

Credential Add를 눌러 생성

GitLab과 같은 계정으로 생성하면 된다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_23.png"/></div>

빌드 유발에서 아래와 같이 체크하고 [http://172.16.212.84:8181/project/saproject-skd는](http://172.16.212.84:8181/project/saproject-skd는) GitLab의 webhook 설치시 필요하기 때문에 따로 메모

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_24.png"/></div>

Build Steps에서 Execute shell을 선택 후 저장

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_25.png"/></div>

빌드가 잘 된걸 확인할 수 있다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_26.png"/></div>

webhook 설정을 위해 Secret Token이 필요한데 빌드유발 탭에서 고급 버튼을 누르고 토큰을 생성할 수 있다.

토큰 값을 GitLab에 입력해야되기 때문에 따로 메모

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_27.png"/></div>

GitLab 프로젝트 → Setting → webhook으로 이동

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_30.png"/></div>

아까 메모해둔  http://172.16.212.84:8181/project/saproject-skd, 토큰 값을 넣고 push events 체크

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_31.png"/></div>

webhook을 생성하고 Test에서 Push events를 눌렀을 때 HTTP 200이 표시되면 정상적으로 처리

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_28.png"/></div>

Jenkins에서 아래와 같이 빌드가 정상적으로 처리된 것을 확인할 수 있다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_29.png"/></div>

# CD 구축

WAS를 사용할 VM 1개가 추가로 필요하다. 또한 과제 가이드는 war 파일을 배포하지만 지난 과제때 war파일은 해봤기 때문에 이번에는 Springboot를 사용해 jar 파일을 배포한다. 이때 화면 렌더링은 JSP가 아닌 Thymeleaf를 사용한다.

<aside>
💡 스프링부트 3.1 버전을 사용하며 스프링부트 3.x부터 자바 17버전이 필요하기 때문에
open jdk 17가 jenkins 컨테이너와 WAS VM에 설치 되어있다는 전제로 진행한다.

</aside>

먼저 Jenkins에 빌드된 jar 파일을 WAS VM에 옮겨서 jar 파일을 실행하면 CD가 완료된다. 그러기 위해서 젠킨스의 `Publish Over SSH` 플러그인을 설치해야한다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_32.png"/></div>

설치가 완료 되었다면 Jenkins 관리 → 시스템 설정에 들어가 Publish over SSH 메뉴를 찾는다.

- Name: SSH Server의 이름
- Hostname: 배포 서버의 IP 주소
- Username: 원격 접속할 username
- Remote Directory: 원격 서버에 접속하여 작업하는 디렉토리

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_33.png"/></div>

고급을 눌러 Use Password를 체크하고 Key를 입력해야되는데 Jenkins 도커 bash에 접속해 생성하면 된다.

```bash
#Jenkins Bash 접속
docker exec -it my_jenkins /bin/bash

#ssh-keygen 생성
ssh-keygen

```

Key를 생성했으면 id_rsa , id_rsa.pub 두개의 파일이 생성된 걸 확인할 수 있다.

원격으로 접속할 VM 즉, WAS를 실행할 VM에 접속해 authorized_keys파일 생성 후  id_rsa.pub의 파일 내용을 붙여 넣는다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_35.png"/></div>

그 후 id_rsa 안에 있는 파일 내용을 key에 붙여 넣는다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_34.png"/></div>

Test Configuration을 눌러 Success가 나왔다면 설정 완료

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_36.png"/></div>

Jenkins에서 빌드가 완료 되면 수행할 작업을 설정해야 한다.

이전에 만들어 두었던 saproject로 들어가 빌드 환경에서 아래와 같이 설정한다.

- Name: 이전에 설정해둔 SSH server
- Source files: 원격 서버에 보낼 파일
- Remote prefix : Source files에서 지정한 경로의 하위폴더를 지우는 기능.
    - Jar 파일만 전송
- Remote directory : SSH Server로 지정한 서버의 원격지 폴더
- Exec command : 파일 전송이 모두 끝난 이후에, SSH Server로 지정한 서버에서 실행될 스크립트를 지정할 수 있는 기능

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_37.png"/></div>

원격 작업 디렉토리를 처음에 SSH server 설정할 때 Remote Directory를 /usr, 현재 지정한 폴더 경로를 /root/skd/jar로 설정했기 때문에 Jar 파일들은 /usr/root/skd/jar 경로로 이동하게 된다.

파일이 도착하면 실행할 스크립트에 jar 파일을 실행하는 명령어를 적어주면 **Gitlab에 코드 Push → Jenkins에서 Build → Jar 파일 생성 → WAS VM으로 전달 → 전달 완료 되면 배포 스크립트 실행 → Jar 파일 실행** 과정을 거치면 코드를 push 할 때 마다 새로운 Jar 파일을 실행해 사용자들이 최신 버전을 사용할 수 있게 된다.

/usr/root/skd 경로에 [deploy.sh](http://deploy.sh)를 생성하고 아래와 같이 Jar를 실행할 명령어를 입력한다.

```
echo ">80번 포트 종료"
fuser -k -n tcp 80

echo ">Springboot 실행"
java -jar /usr/root/skd/jar/saproject-skd-0.0.1-SNAPSHOT.jar
```

생성 했으면 실행 권한 부여

```bash
chmod +x deploy.sh
```

또한 80포트와 8080 포트의 방화벽을 열어준다.

```bash
#80포트와 8080 포트 열기
firewall-cmd --permanent --zone=public --add-port=80/tcp
firewall-cmd --permanent --zone=public --add-port=8080/tcp

#방화벽 적용
firewall-cmd --reload
```

# CI / CD 확인

현재 index.html에 텍스트가 Jenkins CI/CD test v1이라고 나와있다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_38.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_39.png"/></div>
해당 텍스트를 수정해 깃으로 Push

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_40.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_42.png"/></div>

/usr/root/skd/jar 디렉토리에 jar 파일이 생성된걸 확인할 수 있다.

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_43.png"/></div>

<div><img src = "../../assets/images/blogImg/gitlab_jenkins_41.png"/></div>

Commit도 잘 나오고 실제 브라우저에서도 최신 버전의 화면을 확인할 수 있다.

# 느낀점

Travis CI로 스프링부트 CI/CD를 해본 경험이 있어 이번 실습은 어렵지는 않았다. 그 당시에는 책을 보고 그대로 실습 했기 때문에 CI/CD가 어떤 구조로 이루어 지는지 신경 안쓰고 실습하는데 몰두 했다면 이번 과제를 하면서 CI/CD가 어떻게 이루어지는지 빠르게 이해했다. 다만 아쉬운건 아직 배포 스크립트를 jar 파일 실행하는 명령어만 작성했는데 만약 jar파일 snapshot 버전이 변경된다던가 이름이 변경될 때 핸들링 하는 방법을 더 공부해야겠다고 생각했다.
