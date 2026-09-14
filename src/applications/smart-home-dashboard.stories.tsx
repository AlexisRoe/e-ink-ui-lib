import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Card } from "../components/card/card.component";
import { ColumnChart } from "../components/column-chart/column-chart.component";
import { Grid } from "../components/grid/grid.component";
import { Icon } from "../components/icons/icon";
import { LineChart } from "../components/line-chart/line-chart.component";
import { Segmented } from "../components/segmented/segmented.component";
import { Slider } from "../components/slider/slider.component";
import { Space } from "../components/space/space.component";
import { Title } from "../components/title/title.component";
import { Toggle } from "../components/toggle/toggle.component";
import { Trend } from "../components/trend/trend.component";
import { Value } from "../components/value/value.component";

/**
 * Example composition: a smart-home dashboard built from `Card`s laid out
 * on a `Grid`, each holding a `Value`/`Trend` reading, a bare `LineChart`/
 * `ColumnChart` (no axis/legend/labels, for a compact at-a-glance sparkline
 * look), or a `Toggle`/`Slider`/`Segmented` control, with `Icon`s for
 * at-a-glance context.
 */
const meta = {
  title: "Applications/Smart Home Dashboard",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEMP_HISTORY = [19.8, 20.1, 20.4, 20.9, 21.3, 21.0, 21.5];
const HUMIDITY_HISTORY = [52, 51, 50, 49, 48, 48, 48];
const ENERGY_USAGE = [2.1, 1.8, 2.4, 3.1, 2.6, 1.9, 2.2];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DashboardDemo() {
  const [lightsOn, setLightsOn] = useState(true);
  const [brightness, setBrightness] = useState(6);
  const [thermostat, setThermostat] = useState(21);
  const [locked, setLocked] = useState(true);
  const [scene, setScene] = useState("home");

  return (
    <div style={{ maxWidth: 720, padding: "1rem" }}>
      <Title size="2" style={{ marginBottom: "var(--eink-size-md)" }}>
        Living Room
      </Title>
      <Space size="16" />
      <Segmented defaultId={scene} onChange={setScene} fullWidth>
        <Segmented.Item id="home">Home</Segmented.Item>
        <Segmented.Item id="away">Away</Segmented.Item>
        <Segmented.Item id="night">Night</Segmented.Item>
      </Segmented>
      <Space size="48" />
      <Grid columns={2} gap="md">
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>Temperature</Card.Title>
              <Card.Subtitle>Living room</Card.Subtitle>
            </Card.Header>
            <Card.Content>
              <Value unit="°C" size="xl">
                {thermostat}
              </Value>
              <Trend direction="up" size="sm">
                +0.5° since morning
              </Trend>
              <Space size="12" />
              <LineChart
                datasets={[{ label: "Temperature", data: TEMP_HISTORY }]}
                withAxis={false}
                withLabel={false}
                withLegend={false}
                height={64}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>Humidity</Card.Title>
              <Card.Subtitle>Living room</Card.Subtitle>
            </Card.Header>
            <Card.Content>
              <Value unit="%" size="xl">
                48
              </Value>
              <Trend direction="down" size="sm">
                -3% since morning
              </Trend>
              <Space size="12" />
              <LineChart
                datasets={[{ label: "Humidity", data: HUMIDITY_HISTORY }]}
                withAxis={false}
                withLabel={false}
                withLegend={false}
                height={64}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>
                <Icon name="circle-half-2" aria-hidden="true" /> Lights
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <Toggle checked={lightsOn} onChange={setLightsOn}>
                Living room lights
              </Toggle>
              <Space />
              <Slider
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={10}
                disabled={!lightsOn}
              >
                Brightness
              </Slider>
            </Card.Content>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>Thermostat</Card.Title>
            </Card.Header>
            <Card.Content>
              <Space size="36" />
              <Space size="10" />
              <Slider value={thermostat} onChange={setThermostat} min={16} max={28} step={1}>
                Target temperature
              </Slider>
            </Card.Content>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>
                <Icon name={locked ? "lock" : "lock-open"} aria-hidden="true" /> Front door
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <Toggle checked={locked} onChange={setLocked}>
                {locked ? "Locked" : "Unlocked"}
              </Toggle>
            </Card.Content>
          </Card>
        </Grid.Item>
        <Grid.Item>
          <Card>
            <Card.Header>
              <Card.Title>Energy usage</Card.Title>
              <Card.Subtitle>This week, kWh/day</Card.Subtitle>
            </Card.Header>
            <Card.Content>
              <ColumnChart
                datasets={[{ label: "Energy", data: ENERGY_USAGE }]}
                categories={DAYS}
                withAxis={false}
                withLabel={false}
                withLegend={false}
                height={64}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>
    </div>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => <DashboardDemo />,
};
