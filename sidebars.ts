import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  getStarted: [
    {
      type: "doc",
      id: "get-started/get-docker",
      label: "Docker 설치하기",
    },
    {
      type: "doc",
      id: "get-started/docker-overview",
      label: "Docker 개요",
    },
    {
      type: "category",
      label: "시작하기",
      link: {
        type: "doc",
        id: "get-started/introduction/index",
      },
      items: [
        "get-started/introduction/get-docker-desktop",
        "get-started/introduction/develop-with-containers",
        "get-started/introduction/build-and-push-first-image",
        "get-started/introduction/whats-next",
      ],
    },
    {
      type: "category",
      label: "Docker 개념",
      items: [
        {
          type: "category",
          label: "기초 개념",
          items: [
            "get-started/docker-concepts/the-basics/what-is-a-container",
            "get-started/docker-concepts/the-basics/what-is-an-image",
            "get-started/docker-concepts/the-basics/what-is-a-registry",
            "get-started/docker-concepts/the-basics/what-is-docker-compose",
          ],
        },
        {
          type: "category",
          label: "이미지 빌드하기",
          items: [
            "get-started/docker-concepts/building-images/understanding-image-layers",
            "get-started/docker-concepts/building-images/writing-a-dockerfile",
            "get-started/docker-concepts/building-images/build-tag-and-publish-an-image",
            "get-started/docker-concepts/building-images/using-the-build-cache",
            "get-started/docker-concepts/building-images/multi-stage-builds",
          ],
        },
        {
          type: "category",
          label: "컨테이너 실행하기",
          items: [
            "get-started/docker-concepts/running-containers/publishing-ports",
            "get-started/docker-concepts/running-containers/overriding-container-defaults",
            "get-started/docker-concepts/running-containers/persisting-container-data",
            "get-started/docker-concepts/running-containers/sharing-local-files",
            "get-started/docker-concepts/running-containers/multi-container-applications",
          ],
        },
      ],
    },
    {
      type: "doc",
      id: "get-started/resources",
      label: "리소스",
    },
    {
      type: "category",
      label: "실습",
      items: [
        {
          type: "doc",
          id: "get-started/workshop/our_app",
          label: "파트 1. 우리의 첫 번째 앱", 
        },
        {
          type: "doc",
          id: "get-started/workshop/updating_app",
          label: "파트 2. 앱 업데이트", 
        },
        {
          type: "doc",
          id: "get-started/workshop/sharing_app",
          label: "파트 3. 앱 공유하기", 
        },
        {
          type: "doc",
          id: "get-started/workshop/persisting_data",
          label: "파트 4. 데이터 유지하기",
        },
        {
          type: "doc",
          id: "get-started/workshop/bind_mounts",
          label: "파트 5. 바인드 마운트",
        },
        {
          type: "doc",
          id: "get-started/workshop/multi_container",
          label: "파트 6. 멀티 컨테이너 앱", 
        },
        {
          type: "doc",
          id: "get-started/workshop/using_compose",
          label: "파트 7. Docker Compose 사용하기", 
        },
        {
          type: "doc",
          id: "get-started/workshop/image_best",
          label: "파트 8. 이미지 최적화 베스트 프랙티스", 
        },
        {
          type: "doc",
          id: "get-started/workshop/what_next",
          label: "파트 9. 다음 단계는?",
        },
      ],
    },
  ],
  manual: ["manual/intro"],
  reference: ["reference/intro"],
};

export default sidebars;
