import { useMemo } from "react"
import { Chart } from "react-charts"

const data = [
    {
      label: 'React Charts',
      data: [
        {
          date: "apakek 1",
          stars: 5,
        },
        {
          date: "apakek 2",
          stars: 8,
        },
        {
          date: "apakek 3",
          stars: 2,
        },
        {
          date: "apakek 4",
          stars: 15,
        },
        // ...
      ]
    },
    {
      label: 'React Charts 2',
      data: [
        {
          date: "apakek 1",
          stars: 50,
        },
        {
          date: "apakek 2",
          stars: 18,
        },
        {
          date: "apakek 3",
          stars: 25,
        },
        {
          date: "apakek 4",
          stars: 10,
        },
        // ...
      ]
    },
    {
      label: 'React Charts 3',
      data: [
        {
          date: "apakek 1",
          stars: 15,
        },
        {
          date: "apakek 2",
          stars: 38,
        },
        {
          date: "apakek 3",
          stars: 24,
        },
        {
          date: "apakek 4",
          stars: 5,
        },
        // ...
      ]
    },
    {
      label: 'React Query',
      data: [
        {
          date: "apakek 1",
          stars: 21,
        },
        {
          date: "apakek 2",
          stars: 3,
        },
        {
          date: "apakek 3",
          stars: 9,
        },
        {
          date: "apakek 4",
          stars: 45,
        },
        // ...
      ]
    }
  ]

  function CnthChart() {
    const primaryAxis = useMemo(
      () => ({
        getValue: datum => datum.date,

      }),
      []
    )
  
    const secondaryAxes = useMemo(
      () => [
        {
          getValue: datum => datum.stars,
          elementType: "line"
        },
      ],
      []
    )
  
    return (
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    )
} 

export default CnthChart