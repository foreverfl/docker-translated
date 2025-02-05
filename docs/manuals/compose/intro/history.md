---
title: Docker Compose의 역사와 개발
linkTitle: History and development
description: Compose V1 및 Compose YAML 스키마 버전 관리의 역사
keywords:
  - compose
  - compose yaml
  - swarm
  - migration
  - compatibility
  - docker compose vs docker-compose
weight: 30
aliases:
- /compose/history/
---

이 페이지는 다음을 제공합니다:
 - Docker Compose CLI 개발의 간략한 역사
 - Compose V1 및 Compose V2를 구성하는 주요 버전 및 파일 형식에 대한 명확한 설명
 - Compose V1과 Compose V2의 주요 차이점

## 소개 {#introduction}

![Compose V1과 Compose V2의 주요 차이점을 보여주는 이미지](../images/v1-versus-v2.png)

위 이미지는 현재 지원되는 Docker Compose CLI 버전이 Compose V2임을 보여줍니다. 이는 [Compose 명세](/reference/compose-file/_index.md)로 정의됩니다.

또한 파일 형식, 명령줄 구문 및 최상위 요소의 차이점을 빠르게 보여줍니다. 이는 다음 섹션에서 더 자세히 다룹니다.

### Docker Compose CLI 버전 관리 {#docker-compose-cli-versioning}

Docker Compose 명령줄 바이너리의 첫 번째 버전은 2014년에 처음 출시되었습니다. 이는 Python으로 작성되었으며 `docker-compose`로 호출됩니다.
일반적으로 Compose V1 프로젝트는 `compose.yml` 파일에 최상위 `version` 요소를 포함하며, 값은 `2.0`에서 `3.8`까지 다양합니다. 이는 특정 [파일 형식](#compose-file-format-versioning)을 참조합니다.

Docker Compose 명령줄 바이너리의 두 번째 버전은 2020년에 발표되었으며, Go로 작성되었고 `docker compose`로 호출됩니다.
Compose V2는 `compose.yml` 파일의 최상위 `version` 요소를 무시합니다.

### Compose 파일 형식 버전 관리 {#compose-file-format-versioning}

Docker Compose CLI는 특정 파일 형식으로 정의됩니다.

Compose V1의 세 가지 주요 파일 형식 버전이 출시되었습니다:
- 2014년 Compose 1.0.0과 함께 Compose 파일 형식 1
- 2016년 Compose 1.6.0과 함께 Compose 파일 형식 2.x
- 2017년 Compose 1.10.0과 함께 Compose 파일 형식 3.x

Compose 파일 형식 1은 최상위 `services` 키가 없기 때문에 이후 모든 형식과 상당히 다릅니다.
이 형식으로 작성된 파일은 역사적 용도로 사용되며 Compose V2에서는 실행되지 않습니다.

Compose 파일 형식 2.x와 3.x는 매우 유사하지만 후자는 Swarm 배포를 대상으로 하는 많은 새로운 옵션이 추가되었습니다다.

Compose CLI 버전 관리, Compose 파일 형식 버전 관리 및 Swarm 모드 사용 여부에 따른 기능 일관성을 유지하며며 혼란을 해소하기 위해 파일 형식 2.x와 3.x는 [Compose 명세](/reference/compose-file/_index.md)로 통합되었습니다.

Compose V2는 프로젝트 정의를 위해 Compose 명세를 사용합니다. 이전 파일 형식과 달리 Compose 명세는 점진적 업데이트 방식을 따르며, 최상위 `version` 요소를 필수 사항이 아닌 선택 사항으로 변경했습니다다. Compose V2는 또한 선택 사양인 [Deploy](/reference/compose-file/deploy.md), [Develop](/reference/compose-file/develop.md) 및 [Build](/reference/compose-file/build.md)를 사용합니다.

[migration](/manuals/compose/releases/migrate.md)을 쉽게 하기 위해 Compose V2는 Compose 파일 형식 2.x/3.x와 Compose 명세 간에 사용되지 않거나 변경된 특정 요소에 대한 하위 호환성을 제공합니다.
