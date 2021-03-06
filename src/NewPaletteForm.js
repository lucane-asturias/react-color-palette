import React, { Component } from "react";
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import DraggableColorList from "./DraggableColorList";
import PaletteFormNav from "./PaletteFormNav";
import ColorPickerForm from "./ColorPickerForm";
import { arrayMove } from "react-sortable-hoc";
import styles from "./styles/NewPaletteFormStyles";
import seedColors from "./seedColors";

class NewPaletteForm extends Component {
  static defaultProps = {
    maxColors: 20
  }
   constructor(props) {
    super(props)
    this.state = {
      open: false,
      colors: seedColors[0].colors
    };
    this.addNewColor = this.addNewColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteColor = this.deleteColor.bind(this);
    this.clearPalette = this.clearPalette.bind(this);
    this.addRandomColor = this.addRandomColor.bind(this);
   };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  addNewColor(newColor) {
    this.setState({ colors: [...this.state.colors, newColor], newColorName: "" });
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  clearPalette() {
    this.setState({ colors: [] })
  }

  addRandomColor() {
    //pick random color from existing palettes
    const allColors = this.props.palettes.map(p => p.colors).flat();
    //filtering out allColors to only generate random color which does NOT already includes in the state 
    const filteredArr = allColors.filter(color => !this.state.colors.includes(color));
    const randomColor = filteredArr[Math.floor(Math.random() * filteredArr.length)];
    this.setState({ colors: [...this.state.colors, randomColor] }) //all colors from state + randomColor;
  }

  handleSubmit(newPalette) {
    console.log(newPalette)
    //making an id based of paletteName (e.g: name is Some Palette; ID is some-palette)
    newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, "-");
    newPalette.colors = this.state.colors
    // const newPalette = {
    //   paletteName: newPaletteName,
    //   id: newPaletteName.toLowerCase().replace(/ /g, "-"),
    //   colors: this.state.colors
    // };
    this.props.savePalette(newPalette);
    this.props.history.push("/");
  }
  deleteColor(colorName) {
    this.setState({
      //filtering out where color.name is colorName
      colors: this.state.colors.filter(color => color.name !== colorName)
    })
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({colors}) => ({
      colors: arrayMove(colors, oldIndex, newIndex),
    }));
  };

  render() {
    const { classes, maxColors, palettes } = this.props;
    const { open, colors } = this.state;
    const paletteIsFull = colors.length >= maxColors; 

    return (
      <div className={classes.root}>
        <PaletteFormNav 
          open={open} 
          palettes={palettes}
          handleSubmit={this.handleSubmit}
          handleDrawerOpen={this.handleDrawerOpen}
        />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.container}>
            <Typography variant="h4" gutterBottom>
              Design Your Palette
            </Typography>
            <div className={classes.buttons}> 
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={this.clearPalette}
                className={classes.button}
              >
                Clear Palette
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                className={classes.button}
                disabled={paletteIsFull}
                onClick={this.addRandomColor}
              >
                Random Color
              </Button>
            </div>
            <ColorPickerForm 
              paletteIsFull={paletteIsFull} 
              addNewColor={this.addNewColor}
              colors={colors}
            />
          </div>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList 
            colors={colors} 
            deleteColor={this.deleteColor} 
            axis='xy'
            onSortEnd={this.onSortEnd}
            distance={20} //unless its moving past 20pixels, it will not be draggable
          />

            
        </main>
      </div>
    );
  }
}
 

export default withStyles(styles, { withTheme: true })(NewPaletteForm);
