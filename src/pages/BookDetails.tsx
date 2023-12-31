/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  useDeleteBookMutation,
  useSingleBookQuery,
} from '@/redux/features/book/bookApi';
import { getFromLocalStorage } from '@/utils/localstorage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/altert-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BookReview from '@/components/bookReview';
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
} from '@/redux/features/wishlist/wishlistApi';
import { IBook } from '@/types/globalTypes';
import {
  useAddToReadSoonMutation,
  useGetReadSoonListQuery,
} from '@/redux/features/readSoon/readSoonApi';

export default function BookDetails() {
  const user = JSON.parse(getFromLocalStorage('user-info')!);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // API
  const [deleteBook, { data, isSuccess, isLoading, isError, error }] =
    useDeleteBookMutation();
  const [
    addToWishlist,
    {
      data: wishlistData,
      isSuccess: wishlistSuccess,
      isLoading: isWishlistLoading,
      isError: isWishlistError,
      error: wishlistError,
    },
  ] = useAddToWishlistMutation();
  const [
    addToReadSoon,
    {
      data: readSoonData,
      isSuccess: readSoonSuccess,
      isLoading: isReadSoonLoading,
      isError: isReadSoonError,
      error: readSoonError,
    },
  ] = useAddToReadSoonMutation();
  const { data: wishlist } = useGetWishlistQuery(user?._id);
  const { data: readSoonList } = useGetReadSoonListQuery(user?._id);

  const navigate = useNavigate();

  const { id } = useParams();
  const { data: book } = useSingleBookQuery(id);

  useEffect(() => {
    if (confirmDelete === true) {
      deleteBook(book?.data?.id);
    }
  }, [confirmDelete, book, deleteBook]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      navigate('/');
      toast.success('You have logged in successfully.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    if (isError === true && error) {
      toast.error(`Something went wrong! Please try again.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (wishlistSuccess && !isWishlistLoading) {
      toast.success('Added to wishlist', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (isWishlistError === true && wishlistError) {
      toast.error(`Something went wrong! Please try again.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (readSoonSuccess && !isReadSoonLoading) {
      toast.success('Added to has been read list', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (isReadSoonError === true && readSoonError) {
      toast.error(`Something went wrong! Please try again.`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  }, [
    isLoading,
    navigate,
    isSuccess,
    error,
    isError,
    data,
    wishlistData,
    isWishlistLoading,
    wishlistError,
    wishlistSuccess,
    isWishlistError,
    readSoonSuccess,
    isReadSoonLoading,
    isReadSoonError,
    readSoonError,
  ]);

  const alreadyAddedToWishlist = wishlist?.data?.wishlist?.find(
    (book: IBook) => book?._id === id
  );

  const handleAddToWishlist = () => {
    if (!user) {
      return toast.error(`Please login to add to wishlist`, {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    if (alreadyAddedToWishlist) {
      toast.error(`Already added to wishlist`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    const object = {
      userId: user?._id,
      email: user?.email,
      bookId: book?.data,
    };

    addToWishlist(object);
  };

  const alreadyAddedToReadSoonList = readSoonList?.data?.wishlist?.find(
    (book: IBook) => book?._id === id
  );

  const handleAddToReadSoon = () => {
    if (!user) {
      return toast.error(`Please login to mark as read`, {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    if (alreadyAddedToReadSoonList) {
      toast.error(`Already added to wishlist`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    const object = {
      userId: user?._id,
      email: user?.email,
      bookId: book?.data,
    };

    addToReadSoon(object);
  };

  const ratings = book?.data?.reviews?.map((r: any) => r?.rating);
  const sum = ratings?.reduce((acc: number, rating: number) => acc + rating, 0);
  const average = sum / ratings?.length;

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={book?.data?.image}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 relative">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {book?.data?.genre}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {book?.data?.title}
              </h1>
              <h3 className="text-gray-900 text-xl title-font font-medium mb-1">
                @ {book?.data?.author}
              </h3>

              <div className="flex mb-14 mt-4 items-center">
                <div className="border-r-2 border-gray-200 mr-3 pr-3">
                  <span className="text-gray-600 font-semibold">
                    {' '}
                    Reviews: {book?.data?.reviews?.length}
                  </span>
                  <span className="flex items-center">
                    {average ? (
                      <span className="text-gray-600 font-semibold">
                        {' '}
                        Rating: {average?.toFixed(1)}
                      </span>
                    ) : (
                      <> </>
                    )}
                  </span>
                </div>
                <span className="flex items-center">
                  {[...Array(Math.round(average) || 0)].map((_, index) => (
                    <svg
                      key={index}
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-4 h-4 text-yellow-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  {[...Array(5 - (Math.round(average) || 0))].map(
                    (_, index) => (
                      <svg
                        key={index}
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-4 h-4 text-yellow-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )
                  )}
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </a>
                </span>
              </div>

              <p className="leading-relaxed">
                Reading is an act of civilization; it’s one of the greatest acts
                of civilization because it takes the free raw material of the
                mind and builds castles of possibilities.
              </p>
              <div className="flex mt-6 items-center pb-5  border-gray-100 mb-5"></div>

              <div className="flex absolute bottom-0 w-full">
                {book?.data?.creator === user?.id && (
                  <div className="flex">
                    <Link to={`/edit-book/${book?.data?._id}`}>
                      <button className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded mr-3">
                        Edit
                      </button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your book from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => setConfirmDelete(true)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}

                <button
                  onClick={handleAddToReadSoon}
                  className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                >
                  Mark as read
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 ${
                    alreadyAddedToWishlist && 'bg-pink-500 text-white'
                  }`}
                >
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookReview book={book?.data} />
    </>
  );
}
