// 사용자 정의 컴포넌트
import Button from "@site/src/components/Button";
import Card from "@site/src/components/Card";
import Grid from "@site/src/components/Grid";
import GridItem from "@site/src/components/GridItem";
import ParamsCard from "@site/src/components/ParamsCard";
import YoutubeEmbed from "@site/src/components/YoutubeEmbed";
import MDXComponents from "@theme-original/MDXComponents";
import Include from "@site/src/components/Include";

// Docusaurus 기본 제공 컴포넌트
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";


export default {
    ...MDXComponents, Button, Card, Grid, GridItem, YoutubeEmbed, Tabs, TabItem, ParamsCard, Include
};