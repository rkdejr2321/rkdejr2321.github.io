---
title: 엘라스틱서치와 스프링부트 연동 - 환경 설정
excerpt: ELK
autor_porfile: true
share: false
relate: false
categories:
    - Spring Boot
---

# 엘라스틱서치란?
엘라스틱 서치란 Apache Lucene( 아파치 루씬 ) 기반의 Java 오픈소스 분산 검색 엔진이다.
Elasticsearch는 검색을 위해 단독으로 사용되기도 하며,  `ELK`( Elasticsearch / Logstatsh / Kibana )스택으로 사용되기도 합니다.

![ELK](https://github.com/rkdejr2321/rkdejr2321.github.io/assets/77061558/e5bad03d-fe0f-4025-8a59-440304e04925)

- **Elasticsearch**
    - Logstash로부터 받은 데이터를 검색 및 집계를 하여 필요한 관심 있는 정보를 획득
- **Logstash**
    - 다양한 소스( DB, csv파일 등 )의 로그 또는 트랜잭션 데이터를 수집, 집계, 파싱하여 Elasticsearch로 전달
- **Kibana**
    - Elasticsearch의 빠른 검색을 통해 데이터를 시각화 및 모니터링

## 주요 용어와 개념
*  **인덱스(Index)**  
인덱스는 엘라스틱서치에서 데이터를 `저장하고 검색하기 위한 단위`  
인덱스는 하나 이상의 샤드(shard)로 나뉘어져 있으며, 각 샤드는 데이터의 일부를 보유하고 있고 데이터의 색인화와 검색을 위해 **인덱스**가 사용

* **샤드(Shard)**  
샤드는 인덱스의 물리적인 조각으로, 데이터를 `분산하여 저장`하고 `검색 성능을 향상`시키는 역할  
인덱스가 저장되는 서버 노드에 샤드가 할당되어 분산 처리

* **문서(Document)**  
문서는 엘라스틱서치에서 색인화하거나 검색할 수 있는 `기본 데이터 단위`  
JSON 형식으로 저장되며, 각 문서는 고유한 ID를 가지고 있다.

* **타입(Type)**  
하나의 인덱스 내에서는 하나의 타입만이 존재

* **매핑(Mapping)**  
매핑은 인덱스 내의 문서 구조 및 데이터 타입을 `정의하는 과정`

* **검색(Query)**  
텍스트 검색, 범위 검색, 집계(aggregation) 등 다양한 `검색 기능`

* **집계(Aggregation)**  
데이터의 특성을 `분석하고 시각화``

* **클러스터(Cluster)와 노드(Node)**  
엘라스틱서치는 하나 이상의 노드로 구성된 클러스터 형태로 동작  
각 노드는 클러스터 내에서 데이터를 저장하고 관리하며, 클러스터 전체는 데이터의 가용성과 확장성을 보장

## RDB vs Elasticsearch

| 특성 | RDBMS | Elasticsearch |
| --- | --- | --- |
| 데이터 저장 방식 | 정형 데이터 (테이블 형태) | 비정형 데이터 (JSON 문서) |
| 스키마 정의 | 필수 (테이블과 열 정의) | 선택적 (스키마 자유) |
| 쿼리 언어 | SQL | JSON 기반 쿼리 DSL |
| 검색 속도 | 느림 (복잡한 조인이 필요) | 매우 빠름 |
| 가용성 및 확장성 | 일반적으로 제한적 | 높은 가용성과 확장성 |
| 데이터 구조 | 정규화된 테이블 구조 | 역정규화된 문서 구조 |
| 복제 및 샤딩 | 가능 | 가능 |
| 텍스트 검색 및 분석 | 기본적으로 지원하지 않음 | 뛰어난 텍스트 검색 기능 |
| 데이터 시각화 | 별도의 도구 필요 (예: BI 도구) | Kibana와 통합하여 시각화 지원 |
| 사용 사례 | 전통적인 트랜잭션 기반 애플리케이션 | 로그 분석, 전문 검색, 분석 등에 적합 |

## 장점
- **고성능**
    - Elasticsearch의 분산 성질로 인해 대량 볼륨의 데이터를 `병렬`로 처리할 수 있어 쿼리에 최고의 일치 항목을 빠르게 찾을 수 있다.
- **무료 도구 및 플러그인**
    - Elasticsearch는 유명 시각화 및 보고서 도구인 Kibana가 통합되어 제공된다.
    - Beats 및 Logstash와의 통합도 제공하여 소스 데이터를 쉽게 전환하고 Elasticsearch 클러스터에 로드할 수 있다.
    - 언어 분석기 및 제안자 등 다수의 오픈 소스 Elasticsearch 플러그인을 사용하여 애플리케이션에 풍부한 기능을 추가할 수도 있다.
- **실시간에 가까운 운영**
    - 데이터 읽기 및 쓰기와 같은 Elasticsearch 운영은 보통 1초도 안 걸려서 완료되기 때문에 애플리케이션 모니터링 및 이상 탐지와 같은 실시간에 가까운 사용 사례에 Elasticsearch를 사용할 수 있다.
- **쉬운 애플리케이션 개발**
    - Elasticsearch는 Java, Python, PHP, JavaScript, Node.js, Ruby 및 기타 여러 다양한 언어에 대한 지원을 제공한다.

# ELK 설치

## ELK docker-compose
### 파일 디렉토리
nori를 설치하는 파일은 Dockerfile과 docker-compose.yml의 경로를 일치 시킨다.
![image](https://github.com/rkdejr2321/rkdejr2321.github.io/assets/77061558/11ca4137-418f-4834-81ab-ff123eacb53f)

### Dockerfile
```bash
ARG VERSION
FROM docker.elastic.co/elasticsearch/elasticsearch:${VERSION}
RUN elasticsearch-plugin install analysis-nori
```

### docker-compose.yml
```yml
version: "3.7"
services:
  mysql:
    container_name: mysql
    image: mysql:8.0.32
    volumes:
      - ./mysql/data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: <root 비밀번호 설정>
      MYSQL_DATABASE: <사용할 데이터베이스 이름>
    ports:
      - "3307:3306"
    networks:
      - es-bridge

  es:
    build:
      context: .
      args:
        VERSION: 7.15.2
    container_name: es
    environment:
      node.name: single-node
      cluster.name: backtony
      discovery.type: single-node
      xpack.monitoring.enabled: false
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - es-bridge
    volumes:
      - es-data:/usr/share/elasticsearch/data

  kibana:
    container_name: kibana
    image: docker.elastic.co/kibana/kibana:7.15.2
    environment:
      SERVER_NAME: kibana
      ELASTICSEARCH_HOSTS: http://es:9200
    ports:
      - "5601:5601"
    depends_on:
      - es
    networks:
      - es-bridge
  
  logstash:
    container_name: logstash
    image: docker.elastic.co/logstash/logstash:7.15.2
    ports:
      - "5044:5044"
    depends_on:
      - es
    networks:
      - es-bridge
networks:
  es-bridge:
    driver: bridge

volumes:
  es-data:
```

root 비밀번호와 데이터베이스 이름만 작성하고 실행

```bash
$ docker-compose up -d
```
![스크린샷 2023-08-19 오후 10 34 50](https://github.com/rkdejr2321/rkdejr2321.github.io/assets/77061558/4ff29b53-3d63-4efa-8043-616b90a6bc61)

### 결과
localhost:5601로 접속하여 nori가 설치 되었는지 확인  
![스크린샷 2023-08-19 오후 10 37 27](https://github.com/rkdejr2321/rkdejr2321.github.io/assets/77061558/17f73885-1332-4e8e-90e3-eb8a10b1f31c)

![스크린샷 2023-08-19 오후 10 38 32](https://github.com/rkdejr2321/rkdejr2321.github.io/assets/77061558/fe18f7b3-844e-4b9f-a0c2-7ee5217932a8)

## MySQL과 Elasticsearch 연동
MySQL에 있는 데이터를 Elasticsearch에 사용하기 위해 logstash로 데이터를 연동 해주어야 한다.  
logstash 컨테이너에 접속

```bash
$ docker exec -it logstash bash
```

### logstash.yml 수정

```bash
$ vi config/logstash.yml
```

```
==== 기존 내용
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://elasticsearch:9200" ]
====

==== 수정 내용
http.host: "0.0.0.0"

path.data: 'jdbc:mysql://<MySQL 주소>:<포트번호>/<데이터베이스 이름>'
====
```

### logstash.conf 수정

```bash
$ vi pipeline/logstash.conf
```

```
input {
  jdbc {
    jdbc_driver_library => "/usr/share/logstash/logstash-core/lib/jars/mysql-connector-j-8.0.32.jar"
    jdbc_driver_class => "com.mysql.cj.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://<MySQL IP 주소>:<포트 번호>/<데이터베이스 이름>"
    jdbc_user => "root"
    jdbc_password => "0"
    schedule => "*/5 * * * * *"
    statement => "SELECT * FROM <테이블 이름>"
    type => "<테이블 이름>"
  }
}

filter {
    mutate {
      remove_field => ["id", "@version"]
    }
}
output {
    elasticsearch {
      hosts => ["es:9200"]
      index => "<테이블 이름>"
      document_id => "%{테이블 pk 컬럼 이름}"
    }
}
```

### MySQL connector 설치
MySQL Connector 8.0.32.jar를 /usr/share/logstash/logstash-core/lib/jars에 설치

### 실행
```bash
$ cd /usr/share/logstash
$ bin/logstash -f pipeline/logstash.conf
```
