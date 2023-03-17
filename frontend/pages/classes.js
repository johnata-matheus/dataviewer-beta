import ClassCard from '../components/classCard.jsx'
import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { getAPIClient } from '../utils/axiosapi'
import { parseCookies } from 'nookies'
import Link from 'next/link'

import { Box, Typography } from '@mui/material'

export default function Classes({ classes }) {
  console.log('Front side: ' + classes[0].name)
  const { user } = useContext(AuthContext)
  return (
    <>
      <Box
        sx={{
          width: '100%'
        }}
      >
        <Box className={styles.maincard}>
          <Typography
            variant="h2"
            sx={{
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            Turmas
          </Typography>
          <Box className={styles.containerclasses}>
            {classes.map(classe => (
              <Link href={`/classes/${classe.id_class}`} key={classe.id_class}>
                <ClassCard
                  title={classe.name}
                  year={classe.year}
                  semester={classe.semester}
                />
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export async function getServerSideProps(context) {
  const apiClient = getAPIClient(context)
  const { ['nextautht1.token']: token } = parseCookies(context)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  //console.log("Server side token: ", token)
  const classes = [
    {
      id_class: '59dfe476-1325-433f-b676-c8df9a2c2072',
      name: 'LoP 04 - 2020.1',
      year: '2020',
      semester: '1',
      description: 'ECT2203 Lógica de Programação - Turma 04'
    },
    {
      id_class: '6d04019e-905c-4d70-810a-a7f1fa34fe22',
      name: 'LoP Turma 04 2020.2',
      year: '2021',
      semester: '1',
      description: 'LoP Turma 04 2020.2'
    }
  ]
  console.log('Server side: ' + classes[0].name)
  return {
    props: {
      classes
    }
  }
}
