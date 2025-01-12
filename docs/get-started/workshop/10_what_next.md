---
title: Docker 워크숍 후 다음 단계
weight: 100
linkTitle: "Part 9: What next"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션으로 다음에 할 수 있는 작업에 대한 더 많은 아이디어를 제공
aliases:
  - /get-started/11_what_next/
  - /guides/workshop/10_what_next/
---

워크숍을 마쳤지만, 컨테이너에 대해 배울 것이 아직 많이 남아 있습니다.

다음으로 살펴볼 몇 가지 다른 영역이 있습니다.

## 컨테이너 오케스트레이션 {#container-orchestration}

프로덕션에서 컨테이너를 실행하는 것은 어렵습니다. 단순히 머신에 로그인하여 `docker run` 또는 `docker compose up`을 실행하고 싶지 않을 것입니다. 왜 그럴까요? 컨테이너가 죽으면 어떻게 될까요? 여러 머신에 걸쳐 확장하려면 어떻게 해야 할까요? 컨테이너 오케스트레이션은 이 문제를 해결합니다. Kubernetes, Swarm, Nomad, ECS와 같은 도구들은 모두 약간씩 다른 방식으로 이 문제를 해결합니다.

일반적인 아이디어는 관리자가 예상 상태를 수신하는 것입니다. 이 상태는 "내 웹 앱의 두 인스턴스를 실행하고 포트 80을 노출하고 싶다"일 수 있습니다. 관리자는 클러스터의 모든 머신을 살펴보고 작업을 워커 노드에 위임합니다. 관리자는 변경 사항(예: 컨테이너 종료)을 감시하고 실제 상태가 예상 상태를 반영하도록 작업합니다.

## 클라우드 네이티브 컴퓨팅 재단 프로젝트 {#cloud-native-computing-foundation-projects}

CNCF는 Kubernetes, Prometheus, Envoy, Linkerd, NATS 등 다양한 오픈 소스 프로젝트를 위한 벤더 중립적인 집입니다. [여기에서 졸업 및 인큐베이팅된 프로젝트를 볼 수 있습니다](https://www.cncf.io/projects/) 및 전체 [CNCF Landscape를 여기에서 볼 수 있습니다](https://landscape.cncf.io/). 모니터링, 로깅, 보안, 이미지 레지스트리, 메시징 등과 관련된 문제를 해결하는 많은 프로젝트가 있습니다.

## 시작하기 비디오 워크숍 {#getting-started-video-workshop}

Docker는 DockerCon 2022의 비디오 워크숍을 시청할 것을 권장합니다. 전체 비디오를 시청하거나 다음 링크를 사용하여 특정 섹션에서 비디오를 열 수 있습니다.

- [Docker 개요 및 설치](https://youtu.be/gAGEar5HQoU)
- [컨테이너 가져오기, 실행 및 탐색](https://youtu.be/gAGEar5HQoU?t=1400)
- [컨테이너 이미지 빌드](https://youtu.be/gAGEar5HQoU?t=3185)
- [앱 컨테이너화](https://youtu.be/gAGEar5HQoU?t=4683)
- [DB 연결 및 바인드 마운트 설정](https://youtu.be/gAGEar5HQoU?t=6305)
- [클라우드에 컨테이너 배포](https://youtu.be/gAGEar5HQoU?t=8280)

<YoutubeEmbed videoId="gAGEar5HQoU" />

## 처음부터 컨테이너 만들기 {#creating-a-container-from-scratch}

컨테이너가 처음부터 어떻게 만들어지는지 보고 싶다면, Aqua Security의 Liz Rice가 Go로 처음부터 컨테이너를 만드는 환상적인 강연이 있습니다. 이 강연은 네트워킹, 파일 시스템을 위한 이미지 사용 및 기타 고급 주제에 대해 다루지는 않지만, 작동 방식에 대한 깊은 이해를 제공합니다.

<YoutubeEmbed videoId="8fi7uSYlOdc" />
