import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import {
  Box,
  Container,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

const title = "tRPC, Prisma, Chakra UI on Next.js";

export const Home: NextPage<Props> = (props) => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxW="container.md" pt={8}>
          <Heading as="h1" size="lg">
            {title}
          </Heading>
          <Box pt={8}>
            <Heading as="h2" size="md">
              AWS SDK
            </Heading>
            <S3Buckets buckets={props.buckets} />
          </Box>
          <Box pt={8}>
            <Heading as="h2" size="md">
              tRPC
            </Heading>
            {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
          </Box>
        </Container>
      </main>
    </>
  );
};

export default Home;

interface Bucket {
  name?: string;
  creationDate?: string;
}

interface Props {
  buckets: Bucket[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const c = new S3Client({ endpoint: process.env.AWS_ENDPOINT });
  const r = await c.send(new ListBucketsCommand({}));
  if (r.$metadata.httpStatusCode !== 200) {
    throw new Error(`failed to list-buckets.`);
  }
  if (!r.Buckets) {
    throw new Error(`unexpect Regions is missing.`);
  }
  // console.log({ r });

  const props: Props = {
    buckets: r.Buckets.map((e) => ({
      name: e.Name,
      creationDate: e.CreationDate?.toISOString(),
    })),
  };
  return {
    props,
  };
};

function S3Buckets({ buckets }: Props) {
  const [_buckets, setBuckets] = useState<Props["buckets"]>([]);
  useEffect(() => setBuckets(buckets), [buckets]);
  if (_buckets.length === 0) {
    return (
      <>
        No s3 buckets. Please create a new s3 bucket. Use this command if you
        use localstack.
        <div>
          aws --region ap-northeast-1 --endpoint-url=http://localhost:4566 s3api
          create-bucket --bucket my-1st-bucket --create-bucket-configuration
          LocationConstraint=ap-northeast-1
        </div>
      </>
    );
  }
  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>s3 buckets</TableCaption>
          <Thead>
            <Tr>
              <Th>name</Th>
              <Th>creationDate</Th>
            </Tr>
          </Thead>
          <Tbody>
            {_buckets.slice(0, 5).map((r) => (
              <Tr key={r.name}>
                <Td>{r.name}</Td>
                <Td>{r.creationDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

console.debug(`DATABASE_URL:`, process.env.DATABASE_URL);
console.debug(`NEXTAUTH_URL:`, process.env.NEXTAUTH_URL);
