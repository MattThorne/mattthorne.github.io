import { Education } from 'app/components/education'
import { Freelance } from 'app/components/freelance'
import { Jobs } from 'app/components/jobs'
import { Opensource } from 'app/components/opensource'
import { SideProjects } from 'app/components/projects'

// TODO sort out OG image for work page
export const metadata = {
  title: 'Work',
  description: 'See my recent work.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-4xl mb-8 tracking-tighter">Work</h1>

      <h2 className="font-semibold text-3xl tracking-tighter">Jobs</h2>
      <hr className=""></hr>
      <Jobs />

      <h2 className="font-semibold mt-8 text-3xl tracking-tighter">Freelance</h2>
      <hr className=""></hr>
      <Freelance />

      <h2 className="font-semibold text-3xl mt-8 tracking-tighter">Open Source</h2>
      <hr className=""></hr>
      <Opensource />



      <h2 className="font-semibold text-3xl  mt-8 tracking-tighter">Side Projects</h2>
      <hr className=""></hr>
      <SideProjects />

      <h2 className="font-semibold text-3xl mt-8 tracking-tighter">Education</h2>
      <hr className=""></hr>
      <Education />
    </section>
  )
}
