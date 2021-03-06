
import TeacherAndProgrammer from './TeacherAndProgrammer'
import LogoWithCaption from "./LogoWithCaption";
import Description from "./Description";
import CloseButton from "./CloseButton";


const About = ({ description }: any) => {
  return (
    <>
      <LogoWithCaption />
      <TeacherAndProgrammer/>
      <Description description={description} />
      <CloseButton />
    </>
  );
};

export default About;
