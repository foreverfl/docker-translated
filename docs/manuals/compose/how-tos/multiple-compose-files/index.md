---
description: Docker Compose에서 여러 Compose 파일을 사용하는 다양한 방법에 대한 일반 개요
keywords:
  - 컴포즈
  - 컴포즈 파일
  - 병합
  - 확장
  - 포함
  - 도커 컴포즈
  - -f 플래그
linkTitle: 여러 Compose 파일 사용
title: 여러 Compose 파일 사용
weight: 80
aliases:
  - /compose/multiple-compose-files/
---

# 여러 Compose 파일 사용 {#use-multiple-compose-files}

이 섹션에는 여러 Compose 파일을 사용하는 방법에 대한 정보가 포함되어 있습니다.

여러 Compose 파일을 사용하면 다양한 환경이나 워크플로에 맞게 Compose 애플리케이션을 사용자 정의할 수 있습니다. 이는 여러 팀에 걸쳐 소유권이 분산된 수십 개의 컨테이너를 사용할 수 있는 대규모 애플리케이션에 유용합니다. 예를 들어, 조직이나 팀이 모노레포를 사용하는 경우 각 팀은 애플리케이션의 하위 집합을 실행하기 위해 자체 "로컬" Compose 파일을 가질 수 있습니다. 그런 다음 다른 팀이 자신의 하위 집합을 실행하는 예상 방법을 정의하는 참조 Compose 파일을 제공해야 합니다. 복잡성은 코드에서 인프라 및 구성 파일로 이동합니다.

여러 Compose 파일을 사용하는 가장 빠른 방법은 명령줄에서 `-f` 플래그를 사용하여 원하는 Compose 파일을 나열하여 Compose 파일을 [병합](merge.md)하는 것입니다. 그러나 [병합 규칙](merge.md#merging-rules)으로 인해 이는 곧 매우 복잡해질 수 있습니다.

Docker Compose는 여러 Compose 파일을 사용할 때 이 복잡성을 관리하기 위한 두 가지 다른 옵션을 제공합니다. 프로젝트의 필요에 따라 다음을 수행할 수 있습니다:

- 다른 Compose 파일을 참조하고 애플리케이션에서 사용하려는 부분을 선택하며 일부 속성을 재정의할 수 있는 [Compose 파일 확장](extends.md).
- Compose 파일에 다른 Compose 파일을 직접 [포함](include.md).
