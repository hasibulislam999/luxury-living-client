import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Mockup from "../../../components/Mockup";
import styles from "../../../styles/customer/book.module.css";
import toast from "react-hot-toast";
import auth from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useSWR from "swr";

const Booking = () => {
  const [user] = useAuthState(auth);
  const [visible, setVisible] = useState(false);
  const [svcs, setSVCS] = useState(null);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: services } = useSWR(
    "https://ll-luxury-living.herokuapp.com/admin/servicing",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  if (!services) return <p>Loading...</p>;

  const handleBooking = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const service = svcs.name;
    const description = svcs.description;
    const avatar = svcs.avatar;
    const paypal = event.target.payment.value;
    const credit = event.target.payment.value;
    const card_number = event.target.cNumber.value;
    const year = event.target.year.value;
    const cvc = event.target.cvc.value;

    const booking = {
      name,
      email,
      service,
      description,
      avatar,
      payment_method: paypal || credit,
      card_number,
      year,
      cvc,
      status: "Pending",
    };

    const { data } = await axios.post(
      "https://ll-luxury-living.herokuapp.com/customer/booking",
      booking
    );

    if (data?.acknowledged) {
      toast.success("Your booking is on pending, please, wait for a while!");
      event.target.reset();
    }
  };
  return (
    <section className="w-full">
      <Head>
        <title>Booking - Luxury Living</title>
      </Head>
      <Mockup>
        <form onSubmit={handleBooking}>
          <div className="flex flex-col gap-y-4">
            <div>
              <input
                className={styles.inputter}
                type="text"
                name="name"
                id="name"
                value={user?.displayName}
                readOnly
              />
            </div>
            <div>
              <input
                className={styles.inputter}
                type="email"
                name="email"
                id="email"
                value={user?.email}
                readOnly
              />
            </div>
            <div>
              <input
                className={styles.inputter}
                type="text"
                name="service"
                id="service"
                placeholder="Enter service"
                value={svcs?.name}
                onClick={() => setVisible(true)}
                onChange={(event) => setSVCS(event.target.value)}
              />
              {visible && (
                <div className="flex flex-col gap-y-2 h-[88px] z-10 overflow-auto mt-4">
                  {services.map((service) => (
                    <p
                      key={service._id}
                      className="bg-white p-2 rounded w-full"
                      onClick={() => setSVCS(service)}
                    >
                      {service.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h4 className="font-bold">Pay with</h4>
            <div className="flex lg:items-center md:items-center lg:gap-x-4 md:gap-x-4 gap-y-4 my-4 lg:flex-row md:flex-row flex-col">
              <span className="flex items-center gap-x-1">
                <input
                  type="radio"
                  name="payment"
                  id="credit"
                  value="Credit Card"
                />
                <Image
                  src="/assets/payments/creadit.svg"
                  alt="creadit card"
                  height={20}
                  width={20}
                />
                <span>Creadit Card</span>
              </span>
              <span className="flex items-center gap-x-1">
                <input type="radio" name="payment" id="paypal" value="Paypal" />
                <Image
                  src="/assets/payments/paypal.svg"
                  alt="master card"
                  height={20}
                  width={20}
                />
                <span>Paypal</span>
              </span>
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <input
                  className={styles.inputter}
                  type="text"
                  name="cNumber"
                  id="cNumber"
                  placeholder="Card Number"
                />
              </div>
              <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-4 gap-y-4">
                <div>
                  <div>
                    {/* <input
                      className={styles.inputter}
                      type="text"
                      name="year"
                      id="Year"
                      placeholder="MM / YY"
                    /> */}

                    <input
                      type="date"
                      name="year"
                      id="year"
                      className={styles.inputter}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <input
                      className={styles.inputter}
                      type="text"
                      name="cvc"
                      id="cvc"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-y-0 gap-y-4">
              <p>
                Your service charge will be{" "}
                <span className="font-bold">$1000</span>
              </p>
              <div className="text-right">
                <button
                  className="btn btn-md rounded bg-[#251D58] text-white w-fit px-8 capitalize"
                  type="Submit"
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </form>
      </Mockup>
    </section>
  );
};
export default Booking;
