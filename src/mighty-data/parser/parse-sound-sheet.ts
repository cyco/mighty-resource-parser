import { SoundSheet } from "../models";
import { InputStream } from "src/util";
import { ResourceFork } from "src/resource-fork";

export default (input: InputStream): SoundSheet => {
  const resourceFork = new ResourceFork(input);

  return new SoundSheet(resourceFork);
};
