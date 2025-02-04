---
description: Docker Compose의 주요 이점 및 사용 사례
keywords:
  - 문서
  - 도큐멘테이션
  - 도커
  - 컴포즈
  - 오케스트레이션
  - 컨테이너
  - 사용 사례
  - 이점
title: 왜 Compose를 사용해야 하나요?
weight: 20
aliases:
  - /compose/features-uses/
---

## Docker Compose의 주요 이점 {#key-benefits-of-docker-compose}

Docker Compose를 사용하면 컨테이너화된 애플리케이션의 개발, 배포 및 관리를 간소화하는 여러 가지 이점이 있습니다:

- 간편한 제어: Docker Compose를 사용하면 여러 컨테이너 애플리케이션을 단일 YAML 파일로 정의하고 관리할 수 있습니다. 이를 통해 다양한 서비스를 오케스트레이션하고 조정하는 복잡한 작업이 간소화되어 애플리케이션 환경을 더 쉽게 관리하고 복제할 수 있습니다.

- 효율적인 협업: Docker Compose 구성 파일은 공유하기 쉬워 개발자, 운영 팀 및 기타 이해 관계자 간의 협업을 촉진합니다. 이러한 협업 접근 방식은 더 원활한 워크플로우, 더 빠른 문제 해결 및 전반적인 효율성 증가로 이어집니다.

- 빠른 애플리케이션 개발: Compose는 컨테이너를 생성하는 데 사용된 구성을 캐시합니다. 변경되지 않은 서비스를 다시 시작할 때 Compose는 기존 컨테이너를 재사용합니다. 컨테이너를 재사용하면 환경 변경을 매우 빠르게 수행할 수 있습니다.

- 환경 간의 이식성: Compose는 Compose 파일에서 변수를 지원합니다. 이러한 변수를 사용하여 다양한 환경 또는 사용자에 맞게 구성을 사용자 정의할 수 있습니다.

- 광범위한 커뮤니티 및 지원: Docker Compose는 활발한 커뮤니티를 기반으로 풍부한 자료, 튜토리얼, 그리고 다양한 지원을 제공합니다. 이 커뮤니티 주도의 생태계는 Docker Compose의 지속적인 발전을 이끌며, 사용자가 문제를 효과적으로 해결할 수 있도록 돕습니다.

## Docker Compose의 일반적인 사용 사례 {#common-use-cases-of-docker-compose}

Compose는 다양한 방식으로 사용할 수 있습니다. 일반적인 사용 사례는 다음과 같습니다.

### 개발 환경 {#development-environments}

소프트웨어를 개발할 때 애플리케이션을 격리된 환경에서 실행하고 상호 작용할 수 있는 능력이 중요합니다. Compose 명령줄 도구를 사용하여 환경을 생성하고 상호 작용할 수 있습니다.

[Compose 파일](/reference/compose-file/_index.md)은 애플리케이션의 모든 서비스 종속성(데이터베이스, 큐, 캐시, 웹 서비스 API 등)을 문서화하고 구성하는 방법을 제공합니다. Compose 명령줄 도구를 사용하여 단일 명령(`docker compose up`)으로 각 종속성에 대해 하나 이상의 컨테이너를 생성하고 시작할 수 있습니다.

이러한 기능을 통해 프로젝트를 시작하는 데 편리한 방법을 제공합니다. Compose는 여러 페이지에 걸친 "개발자 시작 가이드"를 단일 기계 판독 가능한 Compose 파일과 몇 가지 명령으로 줄일 수 있습니다.

### 자동화된 테스트 환경 {#automated-testing-environments}

지속적 배포(CD) 또는 지속적 통합(CI) 프로세스에서 자동화된 테스트는 매우 중요한 요소입니다. 자동화된 E2E(End-to-End) 테스트를 실행하려면 테스트 환경이 필요합니다.Compose를 사용하면 테스트를 위한 격리된 환경을 손쉽게 생성하고 제거할 수 있습니다. [Compose 파일](/reference/compose-file/_index.md)에서 전체 환경을 정의하여 몇 가지 명령으로 이러한 환경을 생성하고 제거할 수 있습니다:

```bash
$ docker compose up -d
$ ./run_tests
$ docker compose down
```

### 단일 호스트 배포 {#single-host-deployments}

Compose는 전통적으로 개발 및 테스트 워크플로우에 초점을 맞춰왔지만, 각 릴리스마다 프로덕션 환경에서 활용할 수 있는 기능을 지속적으로 강화하고 있습니다.

프로덕션 환경에서의 Compose 활용 방법에 대한 자세한 내용은 [프로덕션에서 Compose 사용](/manuals/compose/how-tos/production.md)을 참조하십시오.

## 다음 단계는 무엇인가요? {#whats-next}

- [Compose의 역사 알아보기](history.md)
- [Compose 작동 방식 이해하기](compose-application-model.md)
- [빠른 시작](../gettingstarted.md)
