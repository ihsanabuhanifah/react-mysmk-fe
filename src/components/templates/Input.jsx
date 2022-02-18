export default function Input({ active, ...props }) {
  return (
    <div className="w-full relative border mt-5">
      <input
        {...props}
        id="name"
        type="text"
        className="border px-4 pt-2 pb-4 focus:outline-none w-full "
      />
      <span
        className={`${
          active
            ? "w-4 h-12 block border bg-blue-500 absolute top-0 right-0"
            : "hidden"
        }`}
      ></span>
    </div>
  );
}
