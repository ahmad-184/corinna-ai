type Props = { label: string; message: string };

const Section = ({ label, message }: Props) => {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-sm font-light">{message}</p>
    </div>
  );
};

export default Section;
