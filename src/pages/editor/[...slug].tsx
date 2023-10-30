import Head from 'next/head';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { trpc } from '~/utils/trpc';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/auth';
import Textarea from '~/components/Textarea';

export default function CreateArticlePage() {
  const router = useRouter();
  const articleSlug = (router.query.slug as string[]).join('/');

  const { currentUser, isFetchingUser } = useAuth();

  const { data: article } = trpc.article.getBySlug.useQuery(articleSlug);

  const { mutate: updateArticle, isLoading } = trpc.article.update.useMutation({
    onSuccess: (data) => router.push(`/article/${data.slug}`),
    onError: () => toast('Something went wrong', { type: 'error' }),
  });

  const { handleSubmit, register, getValues } = useForm<{
    title: string;
    description: string;
    body: string;
    // tags: string;
  }>();

  const onSubmit = () => {
    if (!article) return;

    const values = getValues();
    updateArticle({ slug: article?.slug, ...values });
  };

  useEffect(() => {
    // If user is not author of the article, navigate to home page
    if (article?.authorId !== currentUser?.id) {
      router.replace('/');
    }
  }, [article?.authorId, currentUser?.id, router]);

  if (article?.authorId !== currentUser?.id || isFetchingUser) return null;

  return (
    <>
      <Head>
        <title>Editor - Conduit</title>
      </Head>
      <div className="mx-auto mb-10 mt-6 max-w-[960px] px-5">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <Input
            {...register('title')}
            defaultValue={article?.title}
            className="mb-4"
            placeholder="Article Title"
            type="text"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          />
          <Input
            {...register('description')}
            defaultValue={article?.description}
            className="mb-4"
            placeholder="What's this article about?"
            type="text"
            disabled={isLoading}
            variantProps={{ size: 'sm', disabled: isLoading }}
          />
          <Textarea
            {...register('body')}
            defaultValue={article?.body}
            className="mb-4"
            placeholder="Write your article"
            rows={8}
            disabled={isLoading}
            variantProps={{ size: 'sm', disabled: isLoading }}
          />
          {/* <Input
            {...register('tags')}
            className="mb-4"
            placeholder="Enter tags"
            type="text"
            disabled={isLoading}
            variantProps={{ size: 'sm', disabled: isLoading }}
          /> */}
          <Button
            type="submit"
            className="self-end"
            disabled={isLoading}
            variantProps={{ disabled: isLoading }}
          >
            Publish Article
          </Button>
        </form>
      </div>
    </>
  );
}
