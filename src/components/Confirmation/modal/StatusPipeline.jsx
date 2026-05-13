import {
  Check,
} from "lucide-react";

import "../../../styles/confirmation/modal/status-pipeline.css";

const StatusPipeline = ({
  stages = [],
}) => {
  return (
    <div className="hok-order-status-pipeline">

      {stages.map((stage, index) => {

        const isDone =
          stage.state === "done";

        const isCurrent =
          stage.state === "current";

        return (
          <div
            key={stage.label}
            className="hok-order-status-stage"
          >

            <div
              className={`
                hok-order-status-stage-circle
                ${isDone
                  ? "done"
                  : ""}
                ${isCurrent
                  ? "current"
                  : ""}
              `}
            >

              {isDone && (
                <Check/>
              )}

            </div>

            <div
              className={`
                hok-order-status-stage-label
                ${isDone
                  ? "done"
                  : ""}
                ${isCurrent
                  ? "current"
                  : ""}
              `}
            >
              {stage.label}
            </div>

          </div>
        );
      })}

    </div>
  );
};

export default StatusPipeline;