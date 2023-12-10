import CardCoursesService from "@/components/service-ui/card-courses";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LayoutUser from "@/components/layout-user";
import BackToTop from "@/components/scollTop";
import BrowseComponent from "@/components/browse";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { useCourseStore } from "@/zustand/courses";
import { getCourseByFillterAPI, getCourseBySearch } from "@/api/course";
import { useRouter } from "next/router";

type Props = {};
const categories = [
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "IT",
    label: "IT",
  },
  {
    value: "Business",
    label: "Business",
  },
  {
    value: "Finance and Accounting",
    label: "Finance and Accounting",
  },
  {
    value: "Working in the office",
    label: "Working in the office",
  },
  {
    value: "Self development",
    label: "Self development",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Health",
    label: "Health",
  },
  {
    value: "Music",
    label: "Music",
  },
];

const priceCate = [
  {
    value: "free",
    label: "Free",
  },
  {
    value: "paid",
    label: "Paid",
  },
];
function CoursesPage({}: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { setCourses } = useCourseStore();
  const [value, setValue] = useState("");
  const [typePrice, setTypePrice] = useState("");

  const handleChangeTypePrice = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTypePrice((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    (async () => {
      if (value || typePrice) {
        try {
          const res = await getCourseByFillterAPI(typePrice, value);
          setCourses(res.data);
        } catch (error: any) {
          errorToast(error.response.data.message, 2000);
        }
      }
    })();
  }, [value, typePrice]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (router?.query?.q) {
        try {
          const res = await getCourseBySearch(router?.query?.q as string);
          setCourses(res.data);
        } catch (error: any) {
          errorToast(error.response.data.message, 2000);
        }
        setLoading(false);
      }
    })();
  }, [router?.query?.q]);

  return (
    <LayoutUser>
      <BackToTop />
      <Container maxWidth='xl' sx={{ mt: 15 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={3}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography variant='h5'>Categories</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl>
                  <RadioGroup
                    aria-labelledby='demo-controlled-radio-buttons-group'
                    name='controlled-radio-buttons-group'
                    value={value}
                    onChange={handleChange}
                  >
                    {categories.map((item) => (
                      <FormControlLabel
                        key={item.label}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ background: "transparent" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography variant='h5'>Price</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl>
                  <RadioGroup
                    aria-labelledby='demo-controlled-radio-buttons-group'
                    name='controlled-radio-buttons-group'
                    value={typePrice}
                    onChange={handleChangeTypePrice}
                  >
                    {priceCate.map((item) => (
                      <FormControlLabel
                        key={item.label}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Grid container spacing={3}>
              <BrowseComponent />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </LayoutUser>
  );
}
export default CoursesPage;
