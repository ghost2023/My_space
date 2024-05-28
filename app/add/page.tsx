"use client";

import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js for navigation
import spring from "../../public/ff.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useScreen from "@/context/screens";
import Feed from "@/components/screens/feed";
import SettingPage from "@/components/screens/settings";
import Secrets from "@/components/screens/secrets";
import MyDiaries from "@/components/screens/myDiaries";
import { useRouter } from "next/navigation"; // Corrected import statement
import ColorPicker from "@/components/elements/colorpiscker";
import useColor from "@/context/color";
import { DatePickerWithPresets } from "@/components/ui/DatePickerWithPresets";
import useDate from "@/context/date";
import MoodPicker from "@/components/elements/moodPicker";
import useMood from "@/context/mood";
import { Textarea } from "@/components/ui/textarea";
import { BookHeartIcon, Globe, Lock, NotebookPen } from "lucide-react";
import axios from "axios";
import pin from "../../public/uuu.png";
import test from "../../public/uuuu.jpg";
import { Input } from "@/components/ui/input";
import Draggable from "react-draggable";

const cloudName = "dsaitxphg";
const preset_key = "ccelrtz4";

export default function Dashboard() {
  // Receive onSelect as a prop
  const { screen } = useScreen();
  const router = useRouter();
  const { dateGet, setDateGet } = useDate();
  const { setColor, color } = useColor();
  const { mood, setMood } = useMood();
  const [text, setText] = useState("talk to your little diary ...");

  const [profilePic, setProfilePic] = useState<string[]>([]); // Specify string[] for profilePic state

  function handleFile1(event: any) {
    const files = event.target.files;
    if (files) {
      const formDataArray: FormData[] = [];

      // Append each selected file to a separate FormData
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", preset_key);
        formDataArray.push(formData);
      }

      // Upload each FormData and collect the response URLs
      Promise.all(
        formDataArray.map((formData) =>
          axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          )
        )
      )
        .then((responses) => {
          const urls = responses.map((res) => res.data.secure_url);
          console.log(urls);
          setProfilePic((prevState) => [...prevState, ...urls]);
        })
        .catch((err) => console.error(err));
    }
  }

  const [diaryStatus, setDiaryStatus] = useState(false);

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const MainScreen = () => {
    switch (screen) {
      case "Feed":
        return <Feed />;
      case "Settings":
        return <SettingPage />;
      case "Secrets":
        return <Secrets />;
      case "MyDiaries":
        return <MyDiaries />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="w-full h-screen md:h-screen flex flex-col md:flex md:flex-row overflow-hidden courier-prime-regular bg-Sidebar">
      <div
        className={`bg-${color} md:major h-[30%] md:h-screen rounded-r-md flex mx-5 md:mx-0 mt-2 md:mt-0`}
      >
        <Image
          src={spring}
          alt="spring"
          className="md:h-auto w-12 md:w-24 md:-ml-[49px] -ml-6 mt-2"
        />
        <div className="w-full h-full overflow-y-scroll hide_scroll_bar flex flex-col">
          <h1 className="courier-prime text-xl md:text-2xl md:mt-10 mt-7">
            Date: {dateGet}
          </h1>
          <div>
            <div
              className={`bg-Sidebar text-${color} py-1 w-max px-2 rounded-sm md:mt-5 mt-2 mb-2 text-sm md:text-base `}
            >
              {mood}
            </div>
          </div>
          <p className="text-sm text-start mr-5 md:mr-16 mt-5 whitespace-pre-line flex-wrap text-wrap underline-offset-2">
            {text}
          </p>

          <div className="flex-grow"></div>

          <div className="hide_scroll_bar flex flex-wrap justify-center md:gap-3 md:sticky   md:-bottom-[20%] ">
            {profilePic?.map((url, index) => (
              <div
                key={index}
                className="z-28  w-40 h-40 mb-4"
                style={{
                  transform: `rotate(-${Math.random() * 45}deg)`,
                }}
              >
                <Image
                  className="m-2 pt-4 px-5 pb-10 bg-black rotate-3"
                  src={url}
                  alt={`image-${index}`}
                  width={160}
                  height={160}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="minor md:h-screen minor flex flex-col bg-Sidebar  overflow-y-scroll hide_scroll_bar">
        <div className="h-14 w-full md:flex justify-end items-center hidden ">
          <Link href="/feed">
            <Button className="mx-2 bg-red-400 text-Sidebar hover:bg-red-500">
              Cancel ❌
            </Button>
          </Link>
        </div>

        <div className="flex justify-start md:justify-center mx-5 md:mx-0 items-center">
          <div className="  w-[100%] md:w-auto">
            <ColorPicker />
            <DatePickerWithPresets />

            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Write what is in your mind..."
              className={`text-${color} pt-1 mt-2`}
              rows={3}
            />

            <MoodPicker />

            <div className="mt-2 flex gap-3">
              <Button
                onClick={() => {
                  setDiaryStatus(true);
                }}
                className={`${
                  diaryStatus
                    ? `bg-blue-300 text-sm`
                    : `bg-gray-500 py-1 text-sm`
                } `}
              >
                <Globe className="mr-2" size={18} /> Public
              </Button>

              <Button
                onClick={() => {
                  setDiaryStatus(false);
                }}
                className={`${
                  diaryStatus
                    ? ` text-sm bg-gray-500`
                    : ` bg-red-300 py-1 text-sm`
                }`}
              >
                <Lock className="mr-2" size={18} /> Private
              </Button>
            </div>

            <div className="flex-wrap mt-2 flex">
              <div className="flex-col w-max">
                <div className="flex items-start">
                  <input
                    type="file"
                    className="hidden" // Hide the default file input
                    id="fileInput" // Add an id for label association
                    onChange={handleFile1}
                    multiple
                  />
                  <label
                    htmlFor="fileInput"
                    className="bg-blue-300 cursor-pointer w-auto text-black font-Montserrat rounded px-4 py-2 border border-gray-300 hover:bg-blue-400"
                  >
                    Choose Images
                  </label>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                router.push("/feed");
              }}
              className={`my-3 text-sm bg-${color}`}
            >
              <NotebookPen size={18} className="mx-2 " />
              Create Diary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
