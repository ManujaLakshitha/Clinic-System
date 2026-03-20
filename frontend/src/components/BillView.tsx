type BillViewProps = {
  total: number | null;
};

export default function BillView({ total }: BillViewProps) {
  if (!total) return null;

  return (
    <div>
      <h3>Bill Summary</h3>
      <p>Total Amount: Rs. {total}</p>
    </div>
  );
}