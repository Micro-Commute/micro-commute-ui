import * as React from "react"
import RouteMap from "../components/RouteMap/RouteMap";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
}

const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Micro-Commute
        <br />
        <span style={headingAccentStyles}>— shared mobility for your commute 🌱🚴🏡</span>
      </h1>
      <p style={paragraphStyles}>
        Solving the first and last mile problem for urban commuters change.
      </p>
      <RouteMap/>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Micro-Commute</title>
