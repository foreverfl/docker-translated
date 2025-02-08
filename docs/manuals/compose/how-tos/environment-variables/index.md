---
title: Compose에서 환경 변수 사용
linkTitle: 환경 변수 사용
weight: 40
description: Compose에서 환경 변수를 설정, 사용 및 관리하는 방법에 대한 설명서
keywords:
  - compose
  - 오케스트레이션
  - 환경
  - env 파일
aliases:
  - /compose/environment-variables/
---

Docker Compose에서 환경 변수와 보간을 활용하여 다양한 환경에서 Dockerized 애플리케이션을 더 쉽게 관리하고 배포할 수 있는 유연하고 재사용 가능한 구성을 만들 수 있습니다.

:::tip
환경 변수를 사용하기 전에, Docker Compose에서 환경 변수에 대한 전체 그림을 얻기 위해 모든 정보를 먼저 읽어보세요.
:::

이 섹션에서는 다음을 다룹니다:

- [컨테이너 환경 내에서 환경 변수를 설정하는 방법](set-environment-variables.md)
- [컨테이너 환경 내에서 환경 변수 우선순위가 작동하는 방식](envvars-precedence.md)
- [미리 정의된 환경 변수](envvars.md)

또한 다음을 다룹니다:

- [보간](variable-interpolation.md)을 사용하여 Compose 파일 내에서 변수를 설정하는 방법과 이것이 컨테이너 환경과 어떻게 관련되는지
- 몇 가지 [모범 사례](best-practices.md)
