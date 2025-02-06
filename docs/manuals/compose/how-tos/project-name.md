---
title: 프로젝트 이름 지정
weight: 10
description: Compose에서 프로젝트 이름을 설정하는 다양한 방법과 우선 순위를 이해합니다.
keywords:
  - 이름
  - compose
  - 프로젝트
  - -p 플래그
  - name 최상위 요소
aliases:
- /compose/project-name/
---

Compose에서 기본 프로젝트 이름은 프로젝트 디렉토리의 기본 이름에서 파생됩니다. 그러나 사용자 정의 프로젝트 이름을 설정할 수 있는 유연성이 있습니다.

이 페이지에서는 사용자 정의 프로젝트 이름이 유용한 시나리오의 예를 제공하고, 프로젝트 이름을 설정하는 다양한 방법을 설명하며, 각 접근 방식의 우선 순위를 제공합니다.

:::note
기본 프로젝트 디렉토리는 Compose 파일의 기본 디렉토리입니다. [`--project-directory` 명령줄 옵션](/reference/cli/docker/compose.md#use--p-to-specify-a-project-name)을 사용하여 사용자 정의 값을 설정할 수도 있습니다.
:::

## 예제 사용 사례 {#example-use-cases}

Compose는 프로젝트 이름을 사용하여 환경을 서로 격리합니다. 프로젝트 이름이 유용한 여러 컨텍스트가 있습니다:

- 개발 호스트에서: 단일 환경의 여러 복사본을 생성하여 프로젝트의 각 기능 브랜치에 대해 안정적인 복사본을 실행하는 데 유용합니다.
- CI 서버에서: 프로젝트 이름을 고유한 빌드 번호로 설정하여 빌드 간 간섭을 방지합니다.
- 공유 또는 개발 호스트에서: 동일한 서비스 이름을 공유할 수 있는 다른 프로젝트 간의 간섭을 방지합니다.

## 프로젝트 이름 설정 {#set-a-project-name}

프로젝트 이름은 소문자, 십진수, 대시 및 밑줄만 포함해야 하며 소문자 또는 십진수로 시작해야 합니다. 프로젝트 디렉토리 또는 현재 디렉토리의 기본 이름이 이 제약 조건을 위반하는 경우 대체 메커니즘을 사용할 수 있습니다.

각 방법의 우선 순위는 다음과 같습니다(높은 순위에서 낮은 순위로):

1. `-p` 명령줄 플래그.
2. [COMPOSE_PROJECT_NAME 환경 변수](environment-variables/envvars.md).
3. Compose 파일의 [최상위 `name:` 속성](/reference/compose-file/version-and-name.md). 또는 명령줄에서 `-f` 플래그로 [여러 Compose 파일을 지정](multiple-compose-files/merge.md)한 경우 마지막 `name:`.
4. Compose 파일이 포함된 프로젝트 디렉토리의 기본 이름. 또는 명령줄에서 `-f` 플래그로 [여러 Compose 파일을 지정](multiple-compose-files/merge.md)한 경우 첫 번째 Compose 파일의 기본 이름.
5. Compose 파일이 지정되지 않은 경우 현재 디렉토리의 기본 이름.

## 다음 단계 {#whats-next}

- [여러 Compose 파일 작업](multiple-compose-files/_index.md)에 대해 읽어보세요.
- [샘플 앱](samples-for-compose.md)을 탐색해보세요.
