---
title: 네이버 클라우드의 Source 시리즈를 활용한 인프라 생성 자동화
excerpt: "Source Commit, Build, Deploy with Terraform"
autor_porfile: true
share: false
relate: false
categories:
    - NCP
---

# Source 시리즈를 이용한 CI/CD 파이프라인 구축
네이버 클라우드의 `Source commit`, `Source build`, `Source Deploy` 서비스를 이용해 CI/CD를 손쉽게 구축할 수 있고 `Source Pipline` 서비스를 사용하면 3가지의 단계를 하나의 Job으로 묶어서 실행 및 관리할 수 있는 서비스를 제공한다.

<img src="../../assets/images/blogImg/ncp_source_services.png"/>


# Source Commit
깃허브처럼 소스를 관리할 수 있는 레포지토리를 제공한다.

* 모든 Git 명령어 사용 가능
* 다양한 Git Client(Smart Tree, Source Tree...)와 호환 가능
* 외부의 Git Repository와 연동 가능
* 네이버 클라우드에서 파일들에 대한 보안 취약점을 체크해주는 File Safer 서비스와 연동 가능
  
# Source Build
Source Commit이나 외부 깃허브의 코드를 컴파일하고 빌드한 산출물을 생성하고 저장하는 역할

* 파이썬, 자바, C# 등 다양한 빌드 환경 제공
* 고성능의 전용 인프라 제공
* 빌드 전후 명령어를 통해 빌드에 관련된 명령어 사용 가능

# Source Deploy
Source Build에서 생성된 산출물을 사용자각 지정한 타겟 서버에 파일을 배포하고 적용하는 역할

> 💡타겟 서버에 배포하기 위해 에이전트가 설치되어야하고 설치를 위해 init Scrpit를 작성해야한다.

* Object Storage 및 Source Build 배포 파일 선택
* 사용자가 지정한 서버에 자동 배포 가능
* Auto Scaling 연동 시 Scale-Out된 서버에도 자동 배포
* 배포 단계 별 명령어 실행
* 배포 승인을 통한 제어

# Source Pipline
앞서 3단계 (Souce Commit, Build, Deploy) 프로세스를 통합하는 역할

* 배포 작업을 병렬로 진행
* 빌드 실행 명령어, 배포 시나리오 설정

## 실습 파이프라인
이번 강의에서 진행하는 실습 아키텍처는 아래의 그림처럼 Souce Commit, Build, Deploy를 Pipline으로 통합한다. 또한 자동 인프라 생성을 위해 테라폼을 적용시켜 서버에서 테라폼 코드 실행을 통해 네이버클라우드에 여러 인프라를 자동으로 생성할 수 있다.

<img src="../../assets/images/blogImg/npc_source_series_architecutre.png"/>

> 💡 강의에서 사용하는 소스코드를 찾지 못하여 테라폼으로 vpc를 생성하는 코드를 사용할 예정  
> ❗️ 사전 환경 구성으로 배포를 진행할 서버에 **에이전트**와 **테라폼**이 설치되어 있어야 한다. (본 포스팅에서 해당 과정은 생략)

### 테라폼이란?
테라폼은 하시코프에서 오픈소스로 개발중인 클라우드 **인프라스트럭처 자동화**를 지향하는 코드로서의 인프라스트럭처 `IaC`(Infrastructure as Code) 도구입니다.  
인프라를 코드화 하여 관리 및 버저닝도 가능하고 인프라간의 종속성을 체크하여 실제 환경에 적용 전 확인하는 기능도 제공한다.


### 실습 코드
main.tf

```tf
terraform {
  required_providers {
    ncloud = {
      source  = "NaverCloudPlatform/ncloud"
      version = "~> 2.0"
    }
  }
}
 
provider "ncloud" {
  access_key = "{사용자 Access Key}" #사용자 Access Key
  secret_key = "{사용자 Secret Key}" #사용자 Secret Key 
  region      = "KR" # 리전
  site        = var.site
  support_vpc = true
}
 
resource "ncloud_vpc" "hashicat" {
  ipv4_cidr_block = var.address_space
  name            = "kangdeok-vpc-kr" # 생성할 vpc 이름
}
```

output.tf
```tf
// output "catapp_url" {
//   value = "http://${ncloud_public_ip.hashicat.public_ip}"
// }
```

terraform.tfvars
```tf
# Rename or copy this file to terraform.tfvars
# Prefix must be all lowercase letters, digits, and hyphens.
# Make sure it is at least 5 characters long.

prefix = "kangdeok"
```

variables.tf
```tf
##############################################################################
# Variables File
#
# Here is where we store the default values for all the variables used in our
# Terraform code. If you create a variable with no default, the user will be
# prompted to enter it (or define it via config file or command line flags.)
 
variable "prefix" {
  description = "This prefix will be included in the name of most resources."
}
 
variable "client_ip" {
  description = "https://search.naver.com/search.naver?where=nexearch&sm=top_sug.pre&fbm=1&acr=1&acq=ip&qdt=0&ie=utf8&query=ip+%EC%A3%BC%EC%86%8C+%ED%99%95%EC%9D%B8"
  default = "1.225.185.210"
}
 
variable "region" {
  description = "The region where the resources are created."
  default     = "KR"
}
 
variable "zone" {
  description = "The zone where the resources are created."
  default     = "KR-2"
}
 
variable "site" {
  description = "Ncloud site. By default, the value is public. You can specify only the following value: public, gov, fin. public is for www.ncloud.com. gov is for www.gov-ncloud.com. fin is for www.fin-ncloud.com."
  default     = "public"
}
 
variable "address_space" {
  description = "The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."
  default     = "10.0.0.0/16"
}
 
variable "height" {
  default     = "400"
  description = "Image height in pixels."
}
 
variable "width" {
  default     = "600"
  description = "Image width in pixels."
}
 
variable "placeholder" {
  default     = "placekitten.com"
  description = "Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"
}
```

💡 네이버클라우드 서버에서 terraform apply 명령어를 pipline을 통해 실행하면 variables.tf와 terraform.tfvars 파일의 region과 prefix 값을 가져오지 못하는 이슈가 있어 직접 main.tf에 입력


# 실습
## SourceCommit 생성
<img src="../../assets/images/blogImg/sourcecommit1.png"/>
<img src="../../assets/images/blogImg/sourcecommit2.png"/>
<img src="../../assets/images/blogImg/sourcecommit3.png"/>
<img src="../../assets/images/blogImg/sourcecommit4.png"/>
<img src="../../assets/images/blogImg/sourcecommit5.png"/>
<img src="../../assets/images/blogImg/sourcecommit6.png"/>

<img src="../../assets/images/blogImg/sourcecommit7.png"/>

❗️파일은 한번에 3개씩만 업로드 가능  

<img src="../../assets/images/blogImg/sourcecommit8.png"/>

## SourceBuild 생성
<img src="../../assets/images/blogImg/sourcebuild1.png"/>
<img src="../../assets/images/blogImg/sourcebuild2.png"/>
<img src="../../assets/images/blogImg/sourcebuild3.png"/>
<img src="../../assets/images/blogImg/sourcebuild4.png"/>
<img src="../../assets/images/blogImg/sourcebuild5.png"/>
<img src="../../assets/images/blogImg/sourcebuild6.png"/>
<img src="../../assets/images/blogImg/sourcebuild7.png"/>
<img src="../../assets/images/blogImg/sourcebuild8.png"/>
<img src="../../assets/images/blogImg/sourcebuild9.png"/>


## SourceDeploy 생성
<img src="../../assets/images/blogImg/sourcedeploy1.png"/>
<img src="../../assets/images/blogImg/sourcedeploy2.png"/>
<img src="../../assets/images/blogImg/sourcedeploy3.png"/>
<img src="../../assets/images/blogImg/sourcedeploy4.png"/>
<img src="../../assets/images/blogImg/sourcedeploy5.png"/>
<img src="../../assets/images/blogImg/sourcedeploy6.png"/>
<img src="../../assets/images/blogImg/sourcedeploy7.png"/>
<img src="../../assets/images/blogImg/sourcedeploy8.png"/>
<img src="../../assets/images/blogImg/sourcedeploy9.png"/>
<img src="../../assets/images/blogImg/sourcedeploy10.png"/>
<img src="../../assets/images/blogImg/sourcedeploy11.png"/>
<img src="../../assets/images/blogImg/sourcedeploy12.png"/>
<img src="../../assets/images/blogImg/sourcedeploy13.png"/>

## SourcePipline 생성 및 결과 확인
<img src="../../assets/images/blogImg/sourcepipline1.png"/>
<img src="../../assets/images/blogImg/sourcepipline2.png"/>
<img src="../../assets/images/blogImg/sourcepipline3.png"/>
<img src="../../assets/images/blogImg/sourcepipline4.png"/>
<img src="../../assets/images/blogImg/sourcepipline5.png"/>
<img src="../../assets/images/blogImg/sourcepipline6.png"/>
<img src="../../assets/images/blogImg/sourcepipline7.png"/>
<img src="../../assets/images/blogImg/sourcepipline8.png"/>
<img src="../../assets/images/blogImg/sourcepipline9.png"/>
<img src="../../assets/images/blogImg/sourcepipline10.png"/>
<img src="../../assets/images/blogImg/sourcepipline11.png"/>


#### 출처
이미지와 내용의 출처는 네이버클라우드 강의 (제목: [Source 시리즈를 활용한 인프라 생성 자동화](https://www.edwith.org/nclouddevtools/lecture/64141?isDesc=false))입니다.
