const NotFoundPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="container flex items-center justify-center max-h-screen px-6 py-24 mx-auto">
        <div>
          <p className="text-sm font-medium text-purple-500 dark:text-blue-400">
            404 error
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            We can’t find that page
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
