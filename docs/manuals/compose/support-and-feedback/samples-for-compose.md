---
description: Compose와 관련된 샘플 요약
keywords:
  - 문서
  - 도커
  - 컴포즈
  - 샘플
title: Compose 샘플 앱
linkTitle: Sample apps
weight: 30
aliases:
- /compose/samples-for-compose/
---

다음 샘플들은 Docker Compose를 사용하는 다양한 측면을 보여줍니다. 사전 요구 사항으로, 아직 설치하지 않았다면 [Docker Compose 설치](/manuals/compose/install/_index.md)를 확인하세요.

## 이 샘플들이 다루는 주요 개념 {#key-concepts-these-samples-cover}

샘플들은 다음을 도와줍니다:

- `compose.yml` 및 `docker-stack.yml` [Compose 파일](/reference/compose-file/_index.md)을 사용하여 Docker 이미지 기반의 서비스를 정의합니다.
- `compose.yml`과 [Dockerfiles](/reference/dockerfile/) 간의 관계를 이해합니다.
- Compose 파일에서 애플리케이션 서비스에 호출하는 방법을 배웁니다.
- 애플리케이션 및 서비스를 [swarm](/manuals/engine/swarm/_index.md)에 배포하는 방법을 배웁니다.

## Compose 데모를 위한 샘플 {#samples-tailored-to-demo-compose}

이 샘플들은 Docker Compose에 중점을 둡니다:

- [빠른 시작: Compose와 ELK](https://github.com/docker/awesome-compose/tree/master/elasticsearch-logstash-kibana/README.md) - Docker Compose를 사용하여 ELK - Elasticsearch-Logstash-Kibana를 설정하고 실행하는 방법을 보여줍니다.

- [빠른 시작: Compose와 Django](https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/django/README.md) - Docker Compose를 사용하여 간단한 Django/PostgreSQL 앱을 설정하고 실행하는 방법을 보여줍니다.

- [빠른 시작: Compose와 Rails](https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/rails/README.md) - Docker Compose를 사용하여 Rails/PostgreSQL 앱을 설정하고 실행하는 방법을 보여줍니다.

- [빠른 시작: Compose와 WordPress](https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/wordpress/README.md) - Docker Compose를 사용하여 WordPress를 Docker 컨테이너로 격리된 환경에서 설정하고 실행하는 방법을 보여줍니다.

## Awesome Compose 샘플 {#awesome-compose-samples}

Awesome Compose 샘플들은 Docker Compose를 사용하여 다양한 프레임워크와 기술을 통합하는 출발점을 제공합니다. 모든 샘플은 [Awesome-compose GitHub repo](https://github.com/docker/awesome-compose)에서 사용할 수 있으며, `docker compose up`으로 실행할 준비가 되어 있습니다.
