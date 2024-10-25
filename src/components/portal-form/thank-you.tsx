type Props = {};

const ThankYou = ({}: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center max-w-md">
        <h1 className="font-semibold text-4xl mb-3">Thank you</h1>
        <p className=" font-medium text-iridium dark:text-muted-foreground">
          Thank you for taking the time to fill in this form. We look forward to
          speaking to you soon.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
