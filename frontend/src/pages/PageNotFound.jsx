const PageNotFound = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <img
                src="./404_face.png"
                alt="The page you are looking for dosen't exists."
                className="h-2/5 m-3"
            />
            <div className="m-3 w-72">
                <h2 className=" text-lg font-bold text-gray-600">
                    Page Not Found
                </h2>
                <p className="text-sm font-light">
                    Sorry, but we can't find the page you are looking for...
                </p>
            </div>
        </div>
    );
};
export default PageNotFound;