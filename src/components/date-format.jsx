const formatDate = (dateTimeString) => {
  if (!dateTimeString) return { date: "N/A", time: "N/A" };

  const [dateOnlyRaw, timeOnly] = dateTimeString.split(" ");
  const [year, month, day] = dateOnlyRaw.split("-");

  // Format the date
  const date = new Date(year, month - 1, day).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Format the time with AM/PM
  let time = "N/A";
  if (timeOnly) {
    let [hour, minute] = timeOnly.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 to 12 for 12 AM
    time = `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  return { date, time };
};

export default formatDate;
